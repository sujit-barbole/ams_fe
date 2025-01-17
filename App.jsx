import * as React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
import HomeScreen from './src/screens/HomeScreen.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';
import UserProfileScreen from './src/screens/UserProfileScreen.jsx';
import store from './src/redux/store.jsx';
import { Provider, useSelector, useDispatch } from 'react-redux';
import UpdateUserProfileScreen from './src/screens/UpdateUserProfileScreen.jsx';
import UpdateUserPasswordScreen from './src/screens/UpdateUserPasswordScreen.jsx';
import { TouchableOpacity, Alert, Text, ActivityIndicator } from 'react-native';
import { clearUser } from './src/redux/userSlice.jsx';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen .jsx';
import AddNewProductScreen from './src/screens/AddNewProductScreen.jsx';
import PendingApprovalsScreen from './src/screens/PendingApprovalsScreen.jsx';
import PendingOrdersScreen from './src/screens/PendingOrdersScreen.jsx';
import AllActiveUsersScreen from './src/screens/AllActiveUsersScreen.jsx';
import { setUser } from './src/redux/userSlice'; 
import AddBrandCategoryScreen from './src/screens/AddBrandCategoryScreen.jsx';
import config from './config/index.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UpdateUserProfile" component={UpdateUserProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UpdateUserPassword" component={UpdateUserPasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddNewProduct" component={AddNewProductScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PendingApprovals" component={PendingApprovalsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PendingOrders" component={PendingOrdersScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddBrandCategory" component={AddBrandCategoryScreen} options={{headerShown: false}} />
    <Stack.Screen name="AllActiveUsers" component={AllActiveUsersScreen} options={{headerShown: false}} />
  </Stack.Navigator>
);

// In your App component
const App = () => {
  const userData = useSelector((state) => state.user);
  console.log("App.jsx userData ::: ", userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  
 const navigateToCartData = async (navigation) => {
  setLoading(true);
  try {
    const requestUrl = config.API_URL+'/ams/v1/user/cart/items/'+ userData.user.userId;
    console.log("fetching cart data....")
    console.log("Fetch user cart data Request URL: ", requestUrl);
      const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      const data = await response.json();
      console.log("cart data in app.jsx ::: ", data);
      if (data) {
        console.log("navigating to shopping cart screen")
        navigation.navigate('ShoppingCart', { data }); // Pass the fetched data to ShoppingCartScreen
      } else {
        Alert.alert(
          "Error",
          "Could not fetch cart data.",
          [
              {
                  text: "OK",
                  onPress: () => navigation.navigate('UserProfile'), // Navigate to UserProfile on OK
              }
          ]
      );
      }
  } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong. Please try again.",
        [
            {
                text: "OK",
                onPress: () => navigation.navigate('UserProfile'), // Navigate to UserProfile on OK
            }
        ]
    );
  } finally {
    setLoading(false); // End loading regardless of success or failure
  }
};


  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarInactiveTintColor: '#808080' }}>
      <Tab.Screen 
        name="HomeTab" 
        component={MainStack} 
        options={{
          tabBarIcon: () => (
            <Entypo name={"home"} size={30} color={"#808080"} />
          ) 
        }} 
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        component={UserProfileScreen} 
        options={({ navigation }) => ({
          tabBarIcon: ({ color }) => {
            const route = navigation.getState().routes[navigation.getState().index];
            const currentRoute = route?.name === "HomeTab" ? 
              navigation.getState().routes[navigation.getState().index]?.state?.routes[navigation.getState().routes[navigation.getState().index].state.index]?.name 
              : route.name;

            return (
              <Entypo name={currentRoute === "UserProfile" ? "shopping-cart" : "user"} size={30} color={color} />
            );
          },
          tabBarLabel: () => {
            const route = navigation.getState().routes[navigation.getState().index];
            const currentRoute = route?.name === "HomeTab" ? 
              navigation.getState().routes[navigation.getState().index]?.state?.routes[navigation.getState().routes[navigation.getState().index].state.index]?.name 
              : route.name;

            return (
              <Text>
                {currentRoute === "UserProfile" ? "My Cart" : "Profile"}
              </Text>
            );
          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={async () => {
                const route = navigation.getState().routes[navigation.getState().index];
                const currentRoute = route?.name === "HomeTab" ? 
                  navigation.getState().routes[navigation.getState().index]?.state?.routes[navigation.getState().routes[navigation.getState().index].state.index]?.name 
                  : route.name;

                if (currentRoute === "UserProfile") {
                  navigateToCartData(navigation);
                } else{
                  navigation.navigate('UserProfile');
                }
              }}
            />
          )
        })} 
      />

<Tab.Screen 
  name={userData ? "Log Out" : "Login"}
  component={UserProfileScreen} 
  options={({ navigation }) => ({
    tabBarIcon: ({ color }) => (
      <Entypo name={userData ? "log-out" : "login"} size={30} color={color} />
    ),
    tabBarButton: (props) => (
      <TouchableOpacity
        {...props}
        onPress={() => {
          console.log("userData in APP.jsx ::: ", userData);
          if (!userData) {
            navigation.navigate('Auth', { screen: 'Login' });
          } else {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "OK",
                  onPress: async () => {
                    // Clear user data from AsyncStorage
                    await AsyncStorage.removeItem('user');
                    // Clear user data from Redux store
                    dispatch(clearUser());
                    navigation.navigate('Auth', { screen: 'Login' });
                  }
                }
              ]
            );
          }
        }}
      />
    )
  })} 
/>

    </Tab.Navigator>
  );
}

// In your RootApp component
const RootApp = () => {
  const userData = useSelector((state) => state.user); // Get user data from the store
  console.log("User data stored in store : ", JSON.stringify(userData))
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userData ? (
        <Stack.Screen name="Main" component={App} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

// Main entry point
export default function Main() {
  useEffect(() => {
      const loadUserData = async () => {
        console.log("in loadUserData...")
          try {
              const loginDetails = await AsyncStorage.getItem('user');
              console.log("loginDetails ::: ", loginDetails)
              if (loginDetails) {
                  const parsedLoginDetails = JSON.parse(loginDetails);
                  const userData = parsedLoginDetails.user;
                  console.log("Loaded user data from store: ", userData); // Log the retrieved data
                  store.dispatch(setUser(userData)); // Restore user state
                  //console.log("User state set in store:", parsedUserData); // Log the set state
              }
          } catch (error) {
              console.error("Failed to load user data", error);
          }
      };

      loadUserData();
  }, []);

  return (
      <Provider store={store}>
          <NavigationContainer>
              <RootApp />
          </NavigationContainer>
      </Provider>
  );
}  