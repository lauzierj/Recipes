import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Container,
  Text,
  Box,
  Heading,
  Image,
  // List,
  // ListItem,
  Spinner,
  Center,
  Link,
  Button,
  Checkbox,
  HStack,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiClock, FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  packageFolder?: string;
}

export default function RecipePage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [cookingMode, setCookingMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; status: 'success' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`)
      .then(r => r.json())
      .then((list: Recipe[]) => {
        setRecipe(list.find(r => r.slug === slug) || null);
      });
  }, [slug]);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
        return true;
      } else {
        setAlertMessage({
          text: 'Screen lock prevention not supported. Keep your device active manually.',
          status: 'warning',
        });
        setTimeout(() => setAlertMessage(null), 5000);
        return false;
      }
    } catch (err) {
      console.error('Wake Lock error:', err);
      return false;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  const toggleCookingMode = useCallback(async () => {
    if (!cookingMode) {
      const wakeLockSuccess = await requestWakeLock();
      setCookingMode(true);
      setAlertMessage({
        text: wakeLockSuccess 
          ? 'Cooking Mode Activated! Screen will stay awake. Check off ingredients and steps as you go!'
          : 'Cooking Mode Activated! Note: Screen lock prevention is not available.',
        status: wakeLockSuccess ? 'success' : 'warning',
      });
      setTimeout(() => setAlertMessage(null), 3000);
    } else {
      await releaseWakeLock();
      setCookingMode(false);
      setCheckedItems(new Set());
      setAlertMessage({
        text: 'Cooking Mode Deactivated',
        status: 'info',
      });
      setTimeout(() => setAlertMessage(null), 2000);
    }
  }, [cookingMode, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  const toggleCheck = useCallback((itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  if (!recipe) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.400" />
      </Center>
    );
  }

  // Process image URLs in content for recipepackage images
  const processedContent = recipe.content.replace(
    /!\[([^\]]*)\]\(([-\w]+\.(webp|jpeg|jpg|png|gif))\)/gi,
    (match, alt, filename) => {
      // Use the actual package folder name if available, otherwise fall back to slug
      const folderName = recipe.packageFolder || `${recipe.slug}.recipepackage`;
      const packageBase = `${import.meta.env.BASE_URL}recipes/${folderName}/Photos/`;
      return `![${alt}](${packageBase}${filename})`;
    }
  );

  let stepCounter = 0;
  let ingredientCounter = 0;

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch" mb={6}>
        <HStack justify="space-between">
          <Button
            onClick={toggleCookingMode}
            colorScheme={cookingMode ? 'red' : 'green'}
            leftIcon={<Icon as={cookingMode ? FiX : FiClock} />}
            size="lg"
          >
            {cookingMode ? 'Exit Cooking Mode' : 'Start Cooking Mode'}
          </Button>
        </HStack>
        
        {alertMessage && (
          <Box
            p={4}
            borderRadius="md"
            bg={alertMessage.status === 'success' ? 'green.900' : alertMessage.status === 'warning' ? 'yellow.900' : 'blue.900'}
            borderLeft="4px solid"
            borderLeftColor={alertMessage.status === 'success' ? 'green.500' : alertMessage.status === 'warning' ? 'yellow.500' : 'blue.500'}
          >
            <HStack spacing={3}>
              <Icon
                as={alertMessage.status === 'success' ? FiCheckCircle : alertMessage.status === 'warning' ? FiAlertCircle : FiInfo}
                color={alertMessage.status === 'success' ? 'green.500' : alertMessage.status === 'warning' ? 'yellow.500' : 'blue.500'}
                boxSize={5}
              />
              <Text color="gray.100">{alertMessage.text}</Text>
            </HStack>
          </Box>
        )}
      </VStack>

      <Box color="gray.100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <Heading as="h1" size="2xl" mb={6} color="gray.100">
                {children}
              </Heading>
            ),
            h2: ({ children }) => (
              <Heading as="h2" size="xl" mt={8} mb={4} color="gray.200">
                {children}
              </Heading>
            ),
            h3: ({ children }) => (
              <Heading as="h3" size="lg" mt={6} mb={3} color="gray.200">
                {children}
              </Heading>
            ),
            blockquote: ({ children }) => (
              <Box
                as="blockquote"
                borderLeft="4px"
                borderColor="gray.600"
                pl={4}
                ml={0}
                fontStyle="italic"
                color="gray.400"
                my={4}
              >
                {children}
              </Box>
            ),
            img: ({ src, alt }) => (
              <Image
                src={src}
                alt={alt}
                maxW="100%"
                h="auto"
                borderRadius="lg"
                my={4}
              />
            ),
            a: ({ href, children }) => {
              // Check if this is a hashtag link
              if (href?.startsWith('#') && typeof children === 'string' && children.startsWith('#')) {
                const tag = children.substring(1);
                return (
                  <Link
                    as={RouterLink}
                    to={`/?tag=${encodeURIComponent(tag)}`}
                    color="blue.400"
                    _hover={{ color: 'blue.300' }}
                    display="inline"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <Link
                  href={href}
                  color="blue.400"
                  _hover={{ color: 'blue.300' }}
                  display="inline"
                >
                  {children}
                </Link>
              );
            },
            ul: ({ children }) => {
              // Check if this is an ingredients list (contains pipes)
              const childrenArray = React.Children.toArray(children);
              const isIngredientsList = childrenArray.some(child => {
                if (React.isValidElement(child) && child.props?.children) {
                  const text = React.Children.toArray(child.props.children)
                    .map(c => typeof c === 'string' ? c : '')
                    .join('');
                  return text.includes('|');
                }
                return false;
              });

              if (isIngredientsList && cookingMode) {
                return (
                  <VStack align="stretch" spacing={2} mb={4}>
                    {children}
                  </VStack>
                );
              }
              
              return (
                <Box as="ul" ml={6} mb={4} color="gray.300">
                  {children}
                </Box>
              );
            },
            li: ({ children }) => {
              // Extract text content
              const textContent = React.Children.toArray(children)
                .map(child => {
                  if (typeof child === 'string') return child;
                  if (React.isValidElement(child) && typeof child.props?.children === 'string') {
                    return child.props.children;
                  }
                  return '';
                })
                .join('');

              // Check if this is an ingredient (contains pipes)
              const isIngredient = textContent.includes('|');
              
              if (cookingMode && isIngredient) {
                const parts = textContent.split('|').map(p => p.trim());
                const ingredientId = `ingredient-${ingredientCounter++}`;
                const isChecked = checkedItems.has(ingredientId);
                
                return (
                  <HStack 
                    spacing={3} 
                    opacity={isChecked ? 0.5 : 1}
                    transition="opacity 0.3s"
                    bg="gray.800"
                    p={3}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor="blue.500"
                  >
                    <Checkbox
                      isChecked={isChecked}
                      onChange={() => toggleCheck(ingredientId)}
                      colorScheme="green"
                      size="lg"
                    />
                    <HStack flex={1} justify="space-between">
                      <Text fontWeight="bold" color="gray.100">
                        {parts[0]}
                      </Text>
                      <Text color="gray.400">
                        {parts[1]}
                      </Text>
                      {parts[2] && (
                        <Text fontSize="sm" color="gray.500">
                          {parts[2]}
                        </Text>
                      )}
                    </HStack>
                  </HStack>
                );
              }

              return (
                <Box as="li">{children}</Box>
              );
            },
            p: ({ children }) => {
              // Check if this is an instruction step (not inside a blockquote or other special element)
              const textContent = React.Children.toArray(children)
                .map(child => {
                  if (typeof child === 'string') return child;
                  if (React.isValidElement(child) && typeof child.props?.children === 'string') {
                    return child.props.children;
                  }
                  return '';
                })
                .join('');

              // Simple heuristic: if it's a regular paragraph with substantial text and not a link/special content,
              // treat it as a cooking step
              const isStep = cookingMode && 
                textContent.length > 20 && 
                !textContent.startsWith('#') &&
                !textContent.includes('|');

              if (isStep) {
                const stepId = `step-${stepCounter++}`;
                const isChecked = checkedItems.has(stepId);
                
                return (
                  <HStack 
                    spacing={3} 
                    opacity={isChecked ? 0.5 : 1}
                    transition="opacity 0.3s"
                    mb={4}
                    align="start"
                  >
                    <Checkbox
                      isChecked={isChecked}
                      onChange={() => toggleCheck(stepId)}
                      colorScheme="green"
                      size="lg"
                      mt={1}
                    />
                    <Text lineHeight="tall" color="gray.300" flex={1}>
                      {children}
                    </Text>
                  </HStack>
                );
              }

              return (
                <Text lineHeight="tall" mb={4} color="gray.300">
                  {children}
                </Text>
              );
            },
            hr: () => <Box as="hr" my={6} borderTop="1px solid" borderColor="gray.700" />,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <Text
                  as="code"
                  px={1}
                  py={0.5}
                  bg="gray.800"
                  borderRadius="sm"
                  fontSize="sm"
                  color="blue.300"
                >
                  {children}
                </Text>
              ) : (
                <Box
                  as="pre"
                  p={4}
                  bg="gray.800"
                  borderRadius="md"
                  overflowX="auto"
                  my={4}
                >
                  <Text as="code" fontSize="sm" color="gray.300">
                    {children}
                  </Text>
                </Box>
              );
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </Box>
      
      <Box as="hr" my={8} borderTop="1px solid" borderColor="gray.700" />
      
      <Link
        as={RouterLink}
        to="/"
        color="blue.400"
        _hover={{ color: 'blue.300', textDecoration: 'none' }}
        fontSize="lg"
        display="inline-block"
      >
        ← Back to search
      </Link>
    </Container>
  );
}