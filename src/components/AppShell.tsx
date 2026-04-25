import React, { useState } from 'react';
import { Flex, Heading, Button, View, Divider } from '@aws-amplify/ui-react';
import { Menu, X, Home, Calendar, Mail, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { label: 'Kalender', icon: <Calendar size={20} />, path: '/calendar' },
    { label: 'Einladungen', icon: <Mail size={20} />, path: '/invitations' },
    { label: 'Einstellungen', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <View minHeight="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        padding="1rem"
        backgroundColor="white"
        boxShadow="small"
        position="sticky"
        top="0"
        zIndex={100}
      >
        <Flex alignItems="center">
          <Button onClick={toggleDrawer} variation="link" padding="0.5rem">
            <Menu />
          </Button>
          <Heading level={4} marginLeft="0.5rem">EventPlanner</Heading>
        </Flex>
        <Flex alignItems="center" gap="small">
          {/* User info and sign out removed for POC */}
        </Flex>
      </Flex>

      {/* Main Layout */}
      <Flex flex="1" position="relative">
        {/* Navigation Drawer Overlay */}
        {isDrawerOpen && (
          <View
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            backgroundColor="rgba(0,0,0,0.5)"
            zIndex={101}
            onClick={toggleDrawer}
          />
        )}

        {/* Navigation Drawer */}
        <View
          position="fixed"
          top="0"
          left={isDrawerOpen ? '0' : '-300px'}
          width="280px"
          height="100vh"
          backgroundColor="white"
          zIndex={102}
          transition="left 0.3s ease-in-out"
          boxShadow="large"
          padding="1rem"
        >
          <Flex justifyContent="space-between" alignItems="center" marginBottom="2rem">
            <Heading level={4}>Menü</Heading>
            <Button onClick={toggleDrawer} variation="link">
              <X size={24} />
            </Button>
          </Flex>

          <Flex flexDirection="column" gap="0.5rem">
            {navItems.map((item) => (
              <Button
                key={item.path}
                justifyContent="flex-start"
                variation={location.pathname === item.path ? 'primary' : 'link'}
                onClick={() => {
                  navigate(item.path);
                  setIsDrawerOpen(false);
                }}
                gap="1rem"
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </Flex>
          
          <Divider marginTop="auto" marginBottom="1rem" />
        </View>

        {/* Content */}
        <View as="main" flex="1" backgroundColor="#F5F7FA">
          {children}
        </View>
      </Flex>
    </View>
  );
};

export default AppShell;
