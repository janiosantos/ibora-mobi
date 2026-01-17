# Fluxos do iBora Driver App

Este documento contém os fluxos principais do aplicativo em formato Mermaid.

## 1. Fluxo Completo do Motorista: Online → Corrida → Concluída

```mermaid
graph TD
    A[Motorista Login] --> B[Home Screen]
    B --> C{Toggle Online?}
    C -->|Offline| B
    C -->|Online| D[Aguardando Corridas]
    D --> E[Recebe Solicitação]
    E --> F{Aceitar Corrida?}
    F -->|Rejeitar| D
    F -->|Aceitar| G[Navegar até Pickup]
    G --> H[Chegou no Local]
    H --> I[Aguardar Passageiro]
    I --> J[Iniciar Corrida]
    J --> K[Corrida em Andamento]
    K --> L[Chegou no Destino]
    L --> M[Finalizar Corrida]
    M --> N[Processar Pagamento]
    N --> O[Avaliar Passageiro]
    O --> P[Ganhos Atualizados]
    P --> D
```

## 2. Fluxo de Aceite de Corrida (Transacional)

```mermaid
sequenceDiagram
    participant Driver as Motorista
    participant App as App
    participant Backend as Backend
    participant DB as Database
    
    Driver->>App: Clica "Aceitar"
    App->>Backend: POST /rides/{id}/accept
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: UPDATE rides SET driver_id = ?
    Backend->>DB: UPDATE drivers SET status = 'busy'
    alt Sucesso
        Backend->>DB: COMMIT
        Backend->>App: 200 OK (ride accepted)
        App->>Driver: Navega para "Drive to Pickup"
    else Falha
        Backend->>DB: ROLLBACK
        Backend->>App: 409 Conflict (já aceita)
        App->>Driver: Mostra erro
    end
```

## 3. Fluxo de Pagamento (Pix/Card/Cash)

```mermaid
graph TD
    A[Corrida Finalizada] --> B{Método de Pagamento}
    B -->|Pix| C[Gerar QR Code]
    B -->|Cartão| D[Processar Cartão]
    B -->|Dinheiro| E[Confirmar Recebimento]
    
    C --> F[Aguardar Confirmação]
    F --> G[Webhook Efí]
    G --> H{Pagamento OK?}
    
    D --> I[Provider de Cartão]
    I --> J{Autorizado?}
    
    E --> K[Marcar como Pago]
    
    H -->|Sim| L[Atualizar Ledger]
    H -->|Não| M[Retry/Manual]
    
    J -->|Sim| L
    J -->|Não| M
    
    K --> L
    
    L --> N[Criar Financial Event]
    N --> O[Atualizar Wallet]
    O --> P[Aplicar D+N]
    P --> Q[Notificar Motorista]
```

## 4. Fluxo de Wallet e Settlement D+N

```mermaid
graph LR
    A[Corrida Paga] --> B[Ledger Entry]
    B --> C{Tipo de Ganho}
    
    C -->|Earning| D[Locked Balance]
    C -->|Incentive| E[Credit Balance]
    
    D --> F[Job Diário]
    F --> G{D+N Passou?}
    G -->|Não| D
    G -->|Sim| H[Available Balance]
    
    H --> I{Saque >= R$ 50?}
    I -->|Sim| J[Processar Payout]
    I -->|Não| H
    
    J --> K[Pix para Motorista]
    K --> L[Atualizar Wallet]
```

## 5. Fluxo de Incentivos e Fidelidade

```mermaid
graph TD
    A[Job Periódico] --> B[Calcular Métricas]
    B --> C[Accept Rate]
    B --> D[Completion Rate]
    B --> E[Total KM]
    B --> F[Gross Revenue]
    
    C --> G{Elegível?}
    D --> G
    E --> G
    F --> G
    
    G -->|Sim| H[Criar Incentive]
    G -->|Não| I[Nenhuma Ação]
    
    H --> J{Tipo}
    J -->|Discount| K[Reduzir Comissão]
    J -->|Bonus| L[Adicionar ao Ledger]
    J -->|Free Usage| M[Creditar Wallet]
    J -->|Partner| N[Conceder Benefício]
    
    K --> O[Aplicar em Corridas]
    L --> P[D+N Settlement]
    M --> Q[Uso Imediato]
    N --> R[Voucher Parceiro]
```

## 6. Fluxo de Estados da Corrida (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Requested
    Requested --> Accepted: Motorista aceita
    Requested --> Cancelled: Timeout/Reject
    
    Accepted --> DriverArriving: Navegando
    DriverArriving --> DriverArrived: Chegou
    DriverArrived --> InProgress: Passageiro entrou
    DriverArrived --> Cancelled: Passageiro não apareceu
    
    InProgress --> Completed: Chegou destino
    InProgress --> Cancelled: Cancelamento
    
    Completed --> [*]
    Cancelled --> [*]
```

## 7. Fluxo de Avaliação (Rating)

```mermaid
graph TD
    A[Corrida Finalizada] --> B[Tela de Rating]
    B --> C[Selecionar Estrelas]
    C --> D{Rating >= 3?}
    
    D -->|Sim| E[Mostrar Tags Positivas]
    D -->|Não| F[Mostrar Tags Negativas]
    
    E --> G[Selecionar Tags]
    F --> G
    
    G --> H[Adicionar Comentário]
    H --> I[Enviar Rating]
    
    I --> J[POST /ratings]
    J --> K[Atualizar Rating Médio]
    K --> L[Notificar Passageiro]
    L --> M[Voltar ao Home]
```

## 8. Fluxo de Onboarding

```mermaid
graph TD
    A[Download App] --> B[Login/Signup]
    B --> C{Novo Usuário?}
    
    C -->|Sim| D[Informações Pessoais]
    C -->|Não| E[Home]
    
    D --> F[Informações do Veículo]
    F --> G[Upload Documentos]
    G --> H[Verificação KYC]
    
    H --> I{Aprovado?}
    I -->|Sim| J[Conta Ativa]
    I -->|Não| K[Aguardar Revisão]
    
    J --> E
    K --> L[Notificação de Status]
```

## 9. Fluxo de Notificações Push

```mermaid
sequenceDiagram
    participant Backend as Backend
    participant FCM as Firebase/APNS
    participant App as App
    participant Driver as Motorista
    
    Backend->>FCM: Send Notification
    Note over Backend,FCM: New Ride Request
    
    FCM->>App: Push Notification
    
    alt App em Foreground
        App->>Driver: Modal de Corrida
    else App em Background
        App->>Driver: Notificação
        Driver->>App: Toca na notificação
        App->>Driver: Abre Modal de Corrida
    else App Fechado
        Driver->>App: Toca na notificação
        App->>Driver: Abre app + Modal
    end
```

## 10. Fluxo de Erro e Retry

```mermaid
graph TD
    A[Ação do Usuário] --> B[API Request]
    B --> C{Sucesso?}
    
    C -->|Sim| D[Atualizar UI]
    C -->|Não| E{Tipo de Erro}
    
    E -->|Network| F[Retry Automático]
    E -->|401| G[Refresh Token]
    E -->|409| H[Mostrar Erro]
    E -->|500| I[Tentar Novamente]
    
    F --> J{Tentativa < 3?}
    J -->|Sim| B
    J -->|Não| K[Mostrar Erro]
    
    G --> L{Token OK?}
    L -->|Sim| B
    L -->|Não| M[Logout]
    
    H --> N[Toast Erro]
    I --> O[Botão Retry]
    K --> N
    
    O --> B
```

## Notas sobre os Fluxos

### Fluxo 1: Motorista Online → Corrida
- **Estados principais**: Offline, Online, Busy, In Trip
- **Pontos críticos**: Accept ride (transaction), Start trip, End trip
- **Timeouts**: 30s para aceitar, 5min para chegar

### Fluxo 3: Pagamento
- **Métodos suportados**: Pix, Cartão, Dinheiro
- **Idempotência**: Todas as operações são idempotentes
- **Webhooks**: Retry com backoff exponencial

### Fluxo 4: Wallet D+N
- **D+N**: Configurável por tipo de transação
- **Saque mínimo**: R$ 50,00
- **Settlement**: Job diário às 00:00

### Fluxo 5: Incentivos
- **Cálculo**: Jobs periódicos (diário/semanal/mensal)
- **Tipos**: Discount, Bonus, Free Usage, Partner
- **Validade**: Campanhas têm início e fim

### Fluxo 6: State Machine
- **Estados finais**: Completed, Cancelled
- **Transições**: Apenas as definidas são permitidas
- **Rollback**: Possível antes de InProgress
