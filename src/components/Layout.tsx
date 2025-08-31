import React from 'react';
import { Box, Flex, VStack, Link as ChakraLink, Text, Input, IconButton } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { LuSearch, LuMenu, LuX } from 'react-icons/lu';

interface LayoutProps {
  children: React.ReactNode;
  recipes?: Array<{ title: string; slug: string }>;
  onSearch?: (query: string) => void;
}

export default function Layout({ children, recipes = [], onSearch }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <Flex minH="100vh" bg="bg">
      {/* Sidebar */}
      <Box
        w={sidebarOpen ? "280px" : "0"}
        transition="width 0.2s"
        borderRight="1px"
        borderColor="border"
        bg="bg.subtle"
        overflow="hidden"
        flexShrink={0}
      >
        <VStack align="stretch" p={4} spaceY={4}>
          <Flex align="center" justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Recipes
            </Text>
            <IconButton
              aria-label="Close sidebar"
              size="sm"
              variant="ghost"
              onClick={() => setSidebarOpen(false)}
            >
              <LuX />
            </IconButton>
          </Flex>

          <Box position="relative">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={handleSearch}
              bg="bg"
              borderColor="border"
              _hover={{ borderColor: "border.subtle" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
              pr={10}
            />
            <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
              <LuSearch color="var(--chakra-colors-fg-muted)" />
            </Box>
          </Box>

          <VStack align="stretch" overflowY="auto" maxH="calc(100vh - 160px)" spaceY={1}>
            {recipes.map((recipe) => (
              <ChakraLink
                key={recipe.slug}
                asChild
                _hover={{ textDecoration: 'none' }}
              >
                <Link to={`/recipe/${recipe.slug}`}>
                  <Box
                    px={3}
                    py={2}
                    borderRadius="md"
                    bg={location.pathname === `/recipe/${recipe.slug}` ? "bg.muted" : "transparent"}
                    _hover={{ bg: "bg.muted" }}
                    transition="background 0.2s"
                  >
                    <Text color="fg" fontSize="sm">
                      {recipe.title}
                    </Text>
                  </Box>
                </Link>
              </ChakraLink>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} direction="column">
        {!sidebarOpen && (
          <Box p={4} borderBottom="1px" borderColor="border">
            <IconButton
              aria-label="Open sidebar"
              size="sm"
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
            >
              <LuMenu />
            </IconButton>
          </Box>
        )}
        <Box flex={1} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}