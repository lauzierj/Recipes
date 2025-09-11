import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  HStack,
  VStack,
  // List,
  // ListItem,
  Badge,
  Text,
  // Alert,
  Flex,
  Link,
} from '@chakra-ui/react';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  description?: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`)
      .then(r => r.json())
      .then((data: Recipe[]) => {
        // Extract description from content (the blockquote after the title)
        const recipesWithDescription = data.map(recipe => {
          const lines = recipe.content.split('\n');
          let description = '';
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].startsWith('>')) {
              description = lines[i].substring(1).trim().replace(/#\w+\s*/g, '').trim();
              break;
            }
          }
          return { ...recipe, description };
        });
        setRecipes(recipesWithDescription);
      });
    fetch(`${base}tags.json`).then(r => r.json()).then(setTags);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tagFilter) params.set('tag', tagFilter);
    setSearchParams(params);
  }, [query, tagFilter, setSearchParams]);

  const filtered = recipes.filter(r =>
    (!tagFilter || r.tags.includes(tagFilter)) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.content.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="2xl" color="gray.900">Recipes</Heading>
        
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          size="lg"
          bg="white"
          borderColor="gray.300"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
          _placeholder={{ color: 'gray.400' }}
        />

        <Box>
          <Text fontWeight="bold" mb={3} color="gray.700">Filter by tag:</Text>
          <Box
            overflowX="auto"
            whiteSpace="nowrap"
            pb={2}
            css={{
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'var(--chakra-colors-gray-300)',
                borderRadius: '4px',
              },
            }}
          >
            <HStack gap={2} display="inline-flex">
              <Button
                size="sm"
                variant={tagFilter === '' ? 'solid' : 'outline'}
                colorScheme={tagFilter === '' ? 'blue' : undefined}
                onClick={() => setTagFilter('')}
                borderColor="gray.300"
                color={tagFilter === '' ? 'white' : 'gray.700'}
                bg={tagFilter === '' ? 'blue.600' : 'transparent'}
                _hover={{ 
                  bg: tagFilter === '' ? 'blue.700' : 'gray.100',
                  color: tagFilter === '' ? 'white' : 'gray.800'
                }}
              >
                All
              </Button>
              {tags.map(t => (
                <Button
                  key={t}
                  size="sm"
                  variant={tagFilter === t ? 'solid' : 'outline'}
                  colorScheme={tagFilter === t ? 'blue' : undefined}
                  onClick={() => setTagFilter(t)}
                  borderColor="gray.300"
                  color={tagFilter === t ? 'white' : 'gray.700'}
                  bg={tagFilter === t ? 'blue.600' : 'transparent'}
                  _hover={{ 
                    bg: tagFilter === t ? 'blue.700' : 'gray.100',
                    color: tagFilter === t ? 'white' : 'gray.800'
                  }}
                >
                  #{t}
                </Button>
              ))}
            </HStack>
          </Box>
        </Box>

        {tagFilter && (
          <Box bg="gray.100" borderRadius="md" p={4}>
            <Text>
              Showing recipes tagged with <Text as="span" fontWeight="bold">#{tagFilter}</Text>
            </Text>
          </Box>
        )}

        <VStack align="stretch" gap={0}>
          {filtered.map(r => (
            <Box
              key={r.slug}
              as={RouterLink}
              to={`/recipe/${r.slug}`}
              p={4}
              borderBottom="1px"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50', textDecoration: 'none' }}
              transition="background-color 0.2s"
              cursor="pointer"
              display="block"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="blue.600"
                mb={1}
              >
                {r.title}
              </Text>
              {r.description && (
                <Text
                  fontSize="sm"
                  color="gray.600"
                  mb={2}
                  noOfLines={2}
                >
                  {r.description}
                </Text>
              )}
              {r.tags.length > 0 && (
                <Box
                  overflowX="auto"
                  whiteSpace="nowrap"
                  css={{
                    '&::-webkit-scrollbar': {
                      height: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'var(--chakra-colors-gray-300)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <HStack gap={2} display="inline-flex">
                    {r.tags.map(tag => (
                      <Badge
                        key={tag}
                        size="sm"
                        variant="subtle"
                        bg="gray.200"
                        color="gray.700"
                        cursor="pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTagFilter(tag);
                        }}
                        _hover={{ bg: 'gray.300', color: 'gray.800' }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}