import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CostumeListScreen } from '../screens/CostumeListScreen';
import { CostumeDetailScreen } from '../screens/CostumeDetailScreen';
import { NewCostumeScreen } from '../screens/NewCostumeScreen';
import { NewIdeaScreen } from '../screens/NewIdeaScreen';
import { IdeaDetailScreen } from '../screens/IdeaDetailScreen';
import { WorkbenchScreen } from '../screens/WorkbenchScreen';
import { colors } from '../theme';

const CostumesStack = createNativeStackNavigator();
const WorkbenchStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '500' as const },
};

function CostumesStackNavigator() {
  return (
    <CostumesStack.Navigator screenOptions={screenOptions}>
      <CostumesStack.Screen name="CostumeList" component={CostumeListScreen} options={{ title: 'Costumes' }} />
      <CostumesStack.Screen name="CostumeDetail" component={CostumeDetailScreen} options={({ route }: any) => ({ title: route.params?.costumeName ?? 'Costume' })} />
      <CostumesStack.Screen name="NewCostume" component={NewCostumeScreen} options={{ title: 'New costume' }} />
      <CostumesStack.Screen name="NewIdea" component={NewIdeaScreen} options={{ title: 'New idea' }} />
      <CostumesStack.Screen name="IdeaDetail" component={IdeaDetailScreen} options={{ title: 'Idea' }} />
    </CostumesStack.Navigator>
  );
}

function WorkbenchStackNavigator() {
  return (
    <WorkbenchStack.Navigator screenOptions={screenOptions}>
      <WorkbenchStack.Screen name="WorkbenchHome" component={WorkbenchScreen} options={{ title: 'Workbench' }} />
      <WorkbenchStack.Screen name="IdeaDetail" component={IdeaDetailScreen} options={{ title: 'Idea' }} />
    </WorkbenchStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted }}>
        <Tabs.Screen name="Costumes" component={CostumesStackNavigator} />
        <Tabs.Screen name="Workbench" component={WorkbenchStackNavigator} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
