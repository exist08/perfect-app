# 🎯 Perfect App

A beautiful, feature-rich React Native productivity app with stunning animations and modern UI design.

![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📝 **Todos**
- Create, edit, and delete todos
- Mark todos as complete with animated checkboxes
- Clean, card-based design
- Persistent storage with MMKV

### 📓 **Notes**
- Sticky note-style design with 8 vibrant colors
- Masonry grid layout (Pinterest-style)
- Handwriting fonts for authentic feel
- Interactive animations (rotate, scale)
- Long press to delete
- Full-featured editor modal

### ⚡ **Tasks**
- Priority-based task management (Low, Medium, High)
- Color-coded priority system
- Dual filtering (status + priority)
- Smart sorting by priority and date
- Rich task cards with descriptions
- Live statistics dashboard

### 📅 **Events**
- Timeline-style layout with connecting dots
- 5 event categories (Work, Personal, Social, Health, Other)
- Smart date labels (Today, Tomorrow)
- Reminder toggle system
- Location support
- Auto-sorting by date/time
- Special "Next Up" indicator

### 🎨 **Beautiful Animations**
- Powered by React Native Reanimated v4
- Lottie animations for backgrounds
- Spring physics for natural interactions
- Staggered entrance animations
- Interactive press feedback
- Smooth transitions throughout

## 🚀 Tech Stack

- **React Native** 0.81.4
- **TypeScript** 5.8.3
- **React Navigation** v7 (Native Stack, Bottom Tabs, Drawer)
- **React Native Reanimated** v4.1.2
- **Lottie React Native** v7.3.4
- **MMKV** v3.3.3 (Fast, encrypted storage)
- **React Native Gesture Handler** v2.28.0
- **React Native Safe Area Context** v5.6.1

## 📦 Installation

### Prerequisites

- Node.js >= 20
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/perfect-app.git
   cd perfect-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS pods** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```

## 📱 Project Structure

```
PerfectApp/
├── src/
│   ├── assets/           # Lottie animations
│   ├── components/       # Reusable components
│   │   ├── TodoItem.tsx
│   │   ├── NoteCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── EventCard.tsx
│   ├── screens/          # App screens
│   │   ├── Splash.tsx
│   │   ├── Home.tsx
│   │   ├── Todos.tsx
│   │   ├── Notes.tsx
│   │   ├── Tasks.tsx
│   │   └── UpcomingEvents.tsx
│   ├── types/            # TypeScript types
│   │   ├── todo.ts
│   │   ├── note.ts
│   │   ├── task.ts
│   │   └── event.ts
│   └── utils/
│       └── Constants.tsx # Screen dimensions
├── App.tsx               # App entry point
├── android/              # Android native code
├── ios/                  # iOS native code
└── package.json
```

## 🎨 Design Philosophy

- **Modern UI**: Glass-morphism effects with semi-transparent backgrounds
- **Smooth Animations**: Every interaction is animated for premium feel
- **Consistent Design**: Unified color scheme and spacing system
- **Responsive**: Adapts to all screen sizes
- **Performance**: Native driver animations for 60fps
- **Persistence**: All data saved locally with MMKV

## 🔧 Configuration

### Babel Config
The app uses `react-native-reanimated` plugin for optimized animations:
```javascript
plugins: ['react-native-reanimated/plugin']
```

### Metro Config
Configured to work with Lottie animations and custom assets.

## 📸 Screenshots

*Add your screenshots here*

## 🎯 Key Features Breakdown

### Todos Screen
- ✅ Checkbox animations with spring physics
- 📊 Active/Completed statistics
- 🧹 Clear completed button
- 💾 MMKV persistent storage

### Notes Screen
- 📌 Sticky tape visual effect
- 📄 Page curl shadow effect
- 🎨 8 pastel color options
- 🔄 Random rotation for natural look
- 📱 Two-column masonry layout

### Tasks Screen
- 🎯 Three priority levels
- 🏷️ Color-coded priority bars
- 🔍 Dual filtering system
- 📝 Rich descriptions
- 📊 Live statistics

### Events Screen
- ⏱️ Timeline visualization
- 🔔 Reminder system
- 📍 Location tracking
- 🏷️ 5 category system
- ⚡ Next event highlighting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Anurag

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Lottie team for beautiful animations
- MMKV for fast storage solution
- React Native Reanimated team for smooth animations

---

**Note**: This is a productivity app designed to showcase modern React Native development with beautiful animations and clean architecture.
