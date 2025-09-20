import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  IconButton,
  Flex,
  Icon,
  Button,
} from '@chakra-ui/react';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@chakra-ui/react/menu';

interface HeaderProps {
  recipeName?: string;
  onDownload?: () => void;
}

export default function Header({ recipeName, onDownload }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRecipePage = location.pathname.startsWith('/recipe/');

  return (
    <>
      <Box
        bg="gray.900"
        borderBottom="1px"
        borderColor="gray.700"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="container.md">
          <Flex align="center" justify="space-between" h="60px">
            {/* Left side - Back button */}
            <Box w="48px">
              {isRecipePage && (
                <IconButton
                  aria-label="Back to search"
                  icon={
                    <Icon viewBox="0 0 24 24" boxSize={6}>
                      <path
                        fill="currentColor"
                        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                      />
                    </Icon>
                  }
                  variant="ghost"
                  onClick={() => navigate('/')}
                  color="gray.300"
                  _hover={{ bg: 'gray.800', color: 'white' }}
                />
              )}
            </Box>

            {/* Center - App name */}
            <Heading size="lg" color="gray.100" textAlign="center">
              Recipes
            </Heading>

            {/* Right side - Menu */}
            <Box w="48px">
              {isRecipePage && onDownload && (
                <MenuRoot>
                  <MenuTrigger asChild>
                    <IconButton
                      aria-label="Options"
                      icon={
                        <Icon viewBox="0 0 24 24" boxSize={5}>
                          <path
                            fill="currentColor"
                            d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                          />
                        </Icon>
                      }
                      variant="ghost"
                      color="gray.300"
                      _hover={{ bg: 'gray.800', color: 'white' }}
                    />
                  </MenuTrigger>
                  <MenuContent bg="gray.800" borderColor="gray.700">
                    <MenuItem
                      value="download"
                      onClick={onDownload}
                      bg="gray.800"
                      _hover={{ bg: 'gray.700' }}
                      color="gray.200"
                    >
                      Download Recipe
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Recipe name below header for recipe pages */}
      {isRecipePage && recipeName && (
        <Box bg="gray.850" borderBottom="1px" borderColor="gray.700">
          <Container maxW="container.md">
            <Heading size="md" color="gray.300" py={3}>
              {recipeName}
            </Heading>
          </Container>
        </Box>
      )}
    </>
  );
}