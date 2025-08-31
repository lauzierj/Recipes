import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Container,
  Heading,
  Text,
  Box,
  Link as ChakraLink,
  Badge,
  HStack,
  Image,
  Spinner,
  Center,
  List
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

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
      <Center h="50vh">
        <Spinner size="xl" color="blue.500" />
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
    <Container maxW="container.lg" py={8}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Heading as="h1" size="2xl" mb={6} color="fg">
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading as="h2" size="xl" mt={8} mb={4} color="fg">
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" size="lg" mt={6} mb={3} color="fg">
              {children}
            </Heading>
          ),
          blockquote: ({ children }) => (
            <Box
              as="blockquote"
              borderLeft="4px solid"
              borderColor="border"
              pl={4}
              ml={0}
              fontStyle="italic"
              color="fg.muted"
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
              borderRadius="md"
              my={6}
            />
          ),
          a: ({ href, children }) => {
            // Check if this is a hashtag link
            if (href?.startsWith('#') && typeof children === 'string' && children.startsWith('#')) {
              const tag = children.substring(1);
              return (
                <ChakraLink asChild color="blue.400" _hover={{ textDecoration: 'underline' }}>
                  <Link to={`/?tag=${encodeURIComponent(tag)}`}>
                    {children}
                  </Link>
                </ChakraLink>
              );
            }
            return (
              <ChakraLink href={href} color="blue.400" isExternal>
                {children}
              </ChakraLink>
            );
          },
          ul: ({ children }) => (
            <List.Root as="ul" ml={6} mb={4} gap={2}>
              {children}
            </List.Root>
          ),
          ol: ({ children }) => (
            <List.Root as="ol" ml={6} mb={4} gap={2}>
              {children}
            </List.Root>
          ),
          li: ({ children }) => (
            <List.Item color="fg">
              {children}
            </List.Item>
          ),
          p: ({ children }) => (
            <Text lineHeight="tall" mb={4} color="fg">
              {children}
            </Text>
          ),
          code: ({ children }) => (
            <Box
              as="code"
              bg="bg.muted"
              px={2}
              py={0.5}
              borderRadius="sm"
              fontSize="sm"
              color="fg"
            >
              {children}
            </Box>
          ),
          pre: ({ children }) => (
            <Box
              as="pre"
              bg="bg.muted"
              p={4}
              borderRadius="md"
              overflowX="auto"
              my={4}
              fontSize="sm"
            >
              {children}
            </Box>
          ),
          table: ({ children }) => (
            <Box overflowX="auto" my={4}>
              <Box as="table" width="100%" borderWidth="1px" borderColor="border">
                {children}
              </Box>
            </Box>
          ),
          th: ({ children }) => (
            <Box
              as="th"
              bg="bg.muted"
              p={2}
              borderWidth="1px"
              borderColor="border"
              fontWeight="bold"
              textAlign="left"
              color="fg"
            >
              {children}
            </Box>
          ),
          td: ({ children }) => (
            <Box
              as="td"
              p={2}
              borderWidth="1px"
              borderColor="border"
              color="fg"
            >
              {children}
            </Box>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
      
      <Box mt={8} pt={6} borderTop="1px" borderColor="border">
        <ChakraLink asChild color="blue.400" _hover={{ textDecoration: 'none' }}>
          <Link to="/">
            <HStack>
              <LuArrowLeft />
              <Text>Back to search</Text>
            </HStack>
          </Link>
        </ChakraLink>
      </Box>
    </Container>
  );
}