# iBora Driver App 🚗

Aplicativo mobile para motoristas do iBora, construído com React Native e Expo.

## 🎨 Design System

O app utiliza um design system completo baseado nos padrões das screenshots fornecidas:

- **Cores primárias**: Azul vibrante (#5B51FF)
- **Sistema de espaçamento**: 4/8/12/16/24/32px
- **Tipografia**: Sistema com escala consistente
- **Componentes reutilizáveis**: Button, Input, Card, Avatar, Chip, Rating, etc.
- **Suporte a Light/Dark mode**

## 📱 Telas Implementadas

### Onboarding & Auth
- ✅ Login (phone + password)
- ✅ Vehicle Information (cadastro de veículo)

### Motorista
- ✅ Home (online/offline toggle)
- ✅ Incoming Ride Request (aceitar/rejeitar corrida)
- ✅ Drive to Pickup (navegar até o passageiro)
- ✅ Trip in Progress
- ✅ Trip Completed
- ✅ Earnings (ganhos detalhados)
- ✅ Rating (avaliar passageiro)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- iOS Simulator ou Android Emulator (ou Expo Go no dispositivo físico)

### Instalação

```bash
# Clonar o repositório
cd ibora-mobi/frontend

# Instalar dependências
npm install

# Iniciar o Expo
npm start
```

### Executar no dispositivo

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📦 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Chip.tsx
│   │   ├── MapPlaceholder.tsx
│   │   ├── Rating.tsx
│   │   └── BottomSheet.tsx
│   ├── screens/
│   │   └── driver/        # Telas do motorista
│   │       ├── LoginScreen.tsx
│   │       ├── VehicleInformationScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── IncomingRideRequestScreen.tsx
│   │       ├── DriveToPickupScreen.tsx
│   │       ├── EarningsScreen.tsx
│   │       └── RatingScreen.tsx
│   ├── navigation/        # Configuração de navegação
│   │   └── RootNavigator.tsx
│   ├── theme/             # Design tokens e tema
│   │   ├── tokens.ts
│   │   └── ThemeProvider.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── mock/              # Dados mock para desenvolvimento
│   │   └── data.ts
│   └── utils/             # Helpers e utilities
├── App.tsx                # Entry point
├── app.json               # Expo config
├── package.json
└── tsconfig.json
```

## 🎯 Funcionalidades Principais

### 1. Sistema de Tema
- Light/Dark mode automático
- Tokens de design consistentes
- Provider React Context

### 2. Navegação
- Stack Navigator para fluxos
- Bottom Tab Navigator para navegação principal
- Modais para ride requests e rating

### 3. Componentes Reutilizáveis
Todos os componentes seguem os padrões das screenshots:
- Variantes (primary, secondary, outline, etc.)
- Estados (loading, disabled, error)
- Acessibilidade (tap targets, contraste)

### 4. Mock Data
Dados simulados para desenvolvimento:
- Driver info
- Ride requests
- Earnings history
- Ratings

## 🔧 Stack Técnica

- **Framework**: React Native + Expo
- **Linguagem**: TypeScript
- **Navegação**: React Navigation
- **UI**: Custom Design System
- **Ícones**: @expo/vector-icons
- **State**: React hooks (useState, useContext)
- **Maps**: MapPlaceholder (sem API keys)

## 📝 Padrões de Código

### Componentes
```typescript
// Sempre use TypeScript
interface ComponentProps {
  prop: string;
  optional?: number;
}

export const Component: React.FC<ComponentProps> = ({ prop, optional }) => {
  // Implementation
};
```

### Estilos
```typescript
// Use design tokens
import { colors, spacing, typography } from '../theme/tokens';

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    backgroundColor: colors.primary,
  },
});
```

### Navegação
```typescript
// Type-safe navigation
navigation.navigate('ScreenName', { param: 'value' });
```

## 🎨 Customização

### Cores
Edite `src/theme/tokens.ts`:
```typescript
export const colors = {
  primary: '#5B51FF', // Altere aqui
  // ...
};
```

### Espaçamento
```typescript
export const spacing = {
  base: 16, // Unidade base
  // ...
};
```

## 🐛 Debugging

### Logs
```typescript
console.log('Debug info');
```

### React Native Debugger
1. Abra o app
2. Shake device (ou Cmd+D no iOS / Cmd+M no Android)
3. Selecione "Debug"

## 📚 Próximos Passos

### Backend Integration
1. Substituir mock data por API calls
2. Implementar WebSocket para ride requests em tempo real
3. Adicionar autenticação JWT

### Features
- [ ] Integrar mapa real (Google Maps / Mapbox)
- [ ] Adicionar notificações push
- [ ] Implementar chat em tempo real
- [ ] Adicionar histórico de corridas
- [ ] Wallet e pagamentos
- [ ] Sistema de incentivos

### Otimizações
- [ ] Adicionar testes (Jest + React Native Testing Library)
- [ ] Implementar state management global (Zustand/Redux)
- [ ] Otimizar performance (React.memo, useCallback)
- [ ] Adicionar analytics

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário do iBora.

## 👥 Time

- **UI/UX**: Baseado em padrões Uber/99
- **Desenvolvimento**: iBora Team
- **Design System**: Custom iBora DS

## 🔗 Links Úteis

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Built with ❤️ by iBora Team**
