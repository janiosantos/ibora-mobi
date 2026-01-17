# 📸 ASSETS GUIDE - iBora

## 🎨 **APP ICONS**

### iOS App Icon (Obrigatório)

**Tamanho**: 1024x1024px  
**Formato**: PNG (sem transparência)  
**Nome**: AppIcon.png  

**Design Sugerido**:
```
┌────────────────────┐
│                    │
│    [Logo iBora]    │
│                    │
│   Fundo: Gradiente │
│   Primary → Success│
│                    │
│   Ícone: Carro     │
│   estilizado       │
│                    │
└────────────────────┘
```

**Cores**:
- Background: Gradiente #4F46E5 → #10B981
- Icon: Branco (#FFFFFF)
- Shadow: Subtle

**Tools**:
- Design: Figma/Sketch
- Generator: https://appicon.co
- Tester: https://appicon.build

---

### Android App Icon (Adaptativo)

**Tamanhos Necessários**:
- 512x512px (Play Store)
- Camadas adaptativas:
  - Foreground: 108x108dp
  - Background: 108x108dp

**Arquivo**: ic_launcher.png  

**Safe Zone**: 66x66dp (centro)

---

## 📱 **SCREENSHOTS**

### iOS Screenshots

#### iPhone 6.7" (iPhone 14 Pro Max)
**Resolução**: 1290 x 2796 pixels  
**Quantidade**: 3-10 screenshots  

**Screenshots Sugeridos**:

1. **Home Screen (Passenger)**
```
┌─────────────────────┐
│  iBora - Mobilidade │
│                     │
│   [Mapa Grande]     │
│                     │
│  🎯 Para onde?      │
│  [Campo busca]      │
│                     │
│  ⚡ Corrida Rápida  │
│  💰 Preço Justo     │
│  🔒 Seguro          │
└─────────────────────┘
```

2. **Trip in Progress**
```
┌─────────────────────┐
│   João - ⭐ 4.9     │
│                     │
│   [Mapa com rota]   │
│                     │
│  ⏱ 12 min           │
│  📍 5.2 km          │
│  💵 R$ 36.17        │
│                     │
│  [Chat] [Emergência]│
└─────────────────────┘
```

3. **Payment Options**
```
┌─────────────────────┐
│  Escolha o Pagamento│
│                     │
│  ✓ PIX (instantâneo)│
│  □ Cartão           │
│  □ Dinheiro         │
│                     │
│  Total: R$ 36.17    │
│                     │
│  [Confirmar]        │
└─────────────────────┘
```

4. **Driver Earnings (Driver App)**
```
┌─────────────────────┐
│  Seus Ganhos        │
│                     │
│  Hoje               │
│  R$ 247.50          │
│                     │
│  Esta Semana        │
│  R$ 1,340.00        │
│                     │
│  [Sacar via PIX]    │
└─────────────────────┘
```

5. **Rating Screen**
```
┌─────────────────────┐
│  Avalie sua Viagem  │
│                     │
│  [Avatar Motorista] │
│  João Silva         │
│                     │
│  ⭐⭐⭐⭐⭐         │
│                     │
│  😊 Simpático       │
│  🚗 Dirigiu Bem     │
│  ✨ Carro Limpo     │
│                     │
│  [Enviar]           │
└─────────────────────┘
```

---

#### iPhone 6.5" (iPhone 14 Plus)
**Resolução**: 1242 x 2688 pixels  
**Screenshots**: Mesmas 5 telas

---

#### iPhone 5.5" (iPhone 8 Plus)
**Resolução**: 1242 x 2208 pixels  
**Screenshots**: Mesmas 5 telas

---

### Android Screenshots

#### Phone
**Resolução**: 1080 x 1920 pixels (16:9)  
**Quantidade**: 2-8 screenshots  

**Screenshots**: Mesmas 5 telas do iOS

---

#### 7" Tablet
**Resolução**: 1024 x 600 pixels  
**Quantidade**: 1-8 screenshots (opcional)

---

#### 10" Tablet
**Resolução**: 1280 x 800 pixels  
**Quantidade**: 1-8 screenshots (opcional)

---

## 🎬 **FEATURE GRAPHIC (Android)**

**Tamanho**: 1024 x 500 pixels  
**Formato**: PNG ou JPG  
**Uso**: Destaque no Google Play  

**Design Sugerido**:
```
┌──────────────────────────────────────────┐
│                                          │
│  iBora                    [Logo]         │
│  Mobilidade Urbana        [Ícone Carro]  │
│                                          │
│  🚗 Rápido  💵 Justo  🔒 Seguro         │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🎥 **APP PREVIEW VIDEO (Opcional)**

### iOS
**Duração**: 15-30 segundos  
**Resolução**: 1080p ou 4K  
**Formato**: M4V, MOV, MP4  

**Conteúdo**:
1. Abertura com logo (2s)
2. Solicitar corrida (5s)
3. Motorista aceita (3s)
4. Trip in progress (5s)
5. Pagamento (3s)
6. Rating (3s)
7. Fechamento (2s)

---

### Android
**Duração**: 30 segundos max  
**Orientação**: Portrait ou Landscape  
**Formato**: MP4 ou WEBM  

**Conteúdo**: Mesmo do iOS

---

## 📐 **ESPECIFICAÇÕES TÉCNICAS**

### Cores Principais
```css
/* Primary */
--primary: #4F46E5;
--primary-dark: #4338CA;
--primary-light: #818CF8;

/* Success */
--success: #10B981;
--success-dark: #059669;
--success-light: #34D399;

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;

/* Text */
--text-primary: #111827;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;
```

### Typography
```
/* Titles */
Font: Inter Bold
Size: 24-32px

/* Body */
Font: Inter Regular
Size: 14-16px

/* Captions */
Font: Inter Medium
Size: 12-14px
```

---

## 🛠️ **FERRAMENTAS RECOMENDADAS**

### Design
- **Figma**: Design e protótipos
- **Sketch**: Design macOS
- **Adobe XD**: Alternative

### Screenshot Tools
- **Previewed**: https://previewed.app
- **Screenshot.rocks**: Frame screenshots
- **MockuPhone**: Device mockups

### Icon Generators
- **AppIcon.co**: All sizes
- **MakeAppIcon**: Automated
- **Icon.Kitchen**: Android adaptativo

### Video
- **iMovie**: iOS video editing
- **DaVinci Resolve**: Advanced editing
- **Loom**: Screen recording

---

## 📋 **CHECKLIST DE ASSETS**

### iOS
- [ ] App Icon 1024x1024
- [ ] Screenshots 6.7" (5 telas)
- [ ] Screenshots 6.5" (5 telas)
- [ ] Screenshots 5.5" (5 telas)
- [ ] App Preview Video (opcional)
- [ ] Privacy Policy URL
- [ ] Support URL

### Android
- [ ] App Icon 512x512
- [ ] Feature Graphic 1024x500
- [ ] Screenshots Phone (5 telas)
- [ ] Screenshots 7" Tablet (opcional)
- [ ] Screenshots 10" Tablet (opcional)
- [ ] Promo Video (opcional)
- [ ] Privacy Policy URL

---

## 🎨 **DIRETRIZES DE DESIGN**

### Visual Style
- **Moderno**: Clean, minimal
- **Profissional**: Trust & credibility
- **Friendly**: Approachable, warm
- **Dynamic**: Motion, energy

### Photography
- **Real users**: Authentic photos
- **Diverse**: Inclusive representation
- **Brazilian context**: Local scenarios
- **High quality**: Sharp, well-lit

### Text Overlay
- **Minimal**: Let UI speak
- **Clear**: Easy to read
- **Highlight**: Key features only
- **Localized**: Portuguese

---

## 💡 **DICAS PRO**

### Screenshots
1. Use dados reais (não "Lorem Ipsum")
2. Mostre casos de uso reais
3. Destaque diferenciais únicos
4. Use cores consistentes
5. Adicione sutil motion blur

### App Icon
1. Teste em vários tamanhos
2. Funcione sem texto
3. Reconhecível a distância
4. Consistente com brand

### Feature Graphic
1. Mostre app em ação
2. Destaque 3 features principais
3. Use CTA sutil
4. Brand visible mas não dominante

---

## 📊 **ASSETS DELIVERY**

### Formato de Entrega
```
assets/
├── ios/
│   ├── icon/
│   │   └── AppIcon@1024.png
│   ├── screenshots/
│   │   ├── 6.7/
│   │   │   ├── 01-home.png
│   │   │   ├── 02-trip.png
│   │   │   ├── 03-payment.png
│   │   │   ├── 04-earnings.png
│   │   │   └── 05-rating.png
│   │   ├── 6.5/
│   │   └── 5.5/
│   └── video/
│       └── preview.mp4
└── android/
    ├── icon/
    │   ├── ic_launcher.png (512x512)
    │   └── ic_launcher_adaptive/
    ├── feature-graphic.png
    ├── screenshots/
    │   ├── phone/
    │   ├── 7inch/
    │   └── 10inch/
    └── video/
        └── promo.mp4
```

---

## ✅ **STATUS**

- [ ] App Icon iOS
- [ ] App Icon Android
- [ ] Screenshots iOS (15 total)
- [ ] Screenshots Android (5-15)
- [ ] Feature Graphic
- [ ] Videos (opcional)

**Tempo Estimado**: 4-6 horas  
**Designer**: Necessário  
**Ferramentas**: Figma + Previewed

---

**🎨 Próximo passo**: Criar assets no Figma
