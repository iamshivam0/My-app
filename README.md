# Productivity App

A versatile mobile application designed to boost productivity with features like a calculator, Pomodoro timer, and more.

## Features

### 1. Calculator

- Basic arithmetic operations
- Scientific functions
- History of calculations

### 2. Pomodoro Timer

- Customizable work and break intervals
- Visual and audio notifications
- Session tracking

### 3. Swipeable Tab Navigation

- Smooth navigation between app features
- Intuitive user interface

### 4. Theme Customization

- Light and dark mode options
- Personalized color schemes

### 5. User Profiles

- Create and manage user profiles
- Personalized settings and preferences

## Technical Details

### File Structure

- `app/(tabs)/Calculator.tsx`: Calculator component and logic
- `app/(tabs)/Pomodoro.tsx`: Pomodoro timer component and logic
- `app/(tabs)/index.tsx`: Main app screen or dashboard
- `app/(tabs)/_layout.tsx`: Tab layout configuration
- `components/SwipeableTabView.tsx`: Custom swipeable tab navigation component
- `index.js`: Entry point of the application
- `context/ProfileContext.tsx`: Context for managing user profiles
- `context/ThemeContext.tsx`: Context for managing app themes

### Technologies Used

- React Native
- Expo
- React Navigation
- Context API for state management

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `expo start` to launch the development server

## Usage

1. Open the app on your device or emulator
2. Navigate through the tabs to access different features
3. Use the calculator for quick computations
4. Set up Pomodoro sessions for focused work intervals
5. Customize your profile and app theme in the settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
