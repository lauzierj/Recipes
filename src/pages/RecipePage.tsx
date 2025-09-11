import React, { useEffect, useState } from 'react';
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
  VStack,
} from '@chakra-ui/react';

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

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`)
      .then(r => r.json())
      .then((list: Recipe[]) => {
        setRecipe(list.find(r => r.slug === slug) || null);
      });
  }, [slug]);



  if (!recipe) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.600" />
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

  return (
    <Container maxW="container.md" py={8}>
      <Box color="gray.900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <Heading as="h1" size="2xl" mb={6} color="gray.900">
                {children}
              </Heading>
            ),
            h2: ({ children }) => (
              <Heading as="h2" size="xl" mt={8} mb={4} color="gray.800">
                {children}
              </Heading>
            ),
            h3: ({ children }) => (
              <Heading as="h3" size="lg" mt={6} mb={3} color="gray.800">
                {children}
              </Heading>
            ),
            blockquote: ({ children }) => (
              <Box
                as="blockquote"
                borderLeft="4px"
                borderColor="gray.300"
                pl={4}
                ml={0}
                fontStyle="italic"
                color="gray.600"
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
                    color="blue.600"
                    _hover={{ color: 'blue.700' }}
                    display="inline"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <Link
                  href={href}
                  color="blue.600"
                  _hover={{ color: 'blue.700' }}
                  display="inline"
                >
                  {children}
                </Link>
              );
            },
            ul: ({ children }) => {
              return (
                <Box as="ul" ml={6} mb={4} color="gray.700">
                  {children}
                </Box>
              );
            },
            li: ({ children }) => {
              // Check if this is a simple string that looks like an ingredient
              if (typeof children === 'string' && children.includes(' | ')) {
                const parts = children.split(' | ').map(p => p.trim());
                const ingredientName = parts[0] || '';
                const details = parts[1] || '';
                
                return (
                  <Box as="li" mb={2}>
                    <VStack align="start" spacing={0}>
                      <Text color="gray.900" fontWeight="medium" fontSize="md">
                        {ingredientName}
                      </Text>
                      {details && (
                        <Text color="gray.600" fontSize="sm">
                          {details}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                );
              }
              
              // Regular list item
              return (
                <Box as="li">{children}</Box>
              );
            },
            p: ({ children }) => {
              return (
                <Text lineHeight="tall" mb={4} color="gray.700">
                  {children}
                </Text>
              );
            },
            hr: () => <Box as="hr" my={6} borderTop="1px solid" borderColor="gray.300" />,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <Text
                  as="code"
                  px={1}
                  py={0.5}
                  bg="gray.100"
                  borderRadius="sm"
                  fontSize="sm"
                  color="blue.700"
                >
                  {children}
                </Text>
              ) : (
                <Box
                  as="pre"
                  p={4}
                  bg="gray.100"
                  borderRadius="md"
                  overflowX="auto"
                  my={4}
                  border="1px solid"
                  borderColor="gray.300"
                >
                  <Text as="code" fontSize="sm" color="gray.800">
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
        color="blue.600"
        _hover={{ color: 'blue.700', textDecoration: 'none' }}
        fontSize="lg"
        display="inline-block"
      >
        ← Back to search
      </Link>
    </Container>
  );
}