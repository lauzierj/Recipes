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
  Tag,
  Text,
  // Alert,
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`).then(r => r.json()).then(setRecipes);
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
      <VStack spacing={6} align="stretch">
        <Heading size="2xl" color="gray.100">Recipes</Heading>
        
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          size="lg"
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: 'gray.600' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
          _placeholder={{ color: 'gray.500' }}
        />

        <Box>
          <Text fontWeight="bold" mb={3} color="gray.300">Filter by tag:</Text>
          <Wrap spacing={2}>
            <WrapItem>
              <Button
                size="sm"
                variant={tagFilter === '' ? 'solid' : 'outline'}
                colorScheme={tagFilter === '' ? 'blue' : 'gray'}
                onClick={() => setTagFilter('')}
                borderColor="gray.600"
                _hover={{ bg: tagFilter === '' ? 'blue.700' : 'gray.700' }}
              >
                All
              </Button>
            </WrapItem>
            {tags.map(t => (
              <WrapItem key={t}>
                <Button
                  size="sm"
                  variant={tagFilter === t ? 'solid' : 'outline'}
                  colorScheme={tagFilter === t ? 'blue' : 'gray'}
                  onClick={() => setTagFilter(t)}
                  borderColor="gray.600"
                  _hover={{ bg: tagFilter === t ? 'blue.700' : 'gray.700' }}
                >
                  #{t}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {tagFilter && (
          <Box bg="gray.800" borderRadius="md" p={4}>
            <Text>
              Showing recipes tagged with <Text as="span" fontWeight="bold">#{tagFilter}</Text>
            </Text>
          </Box>
        )}

        <Box>
          {filtered.map(r => (
            <Box
              key={r.slug}
              p={4}
              borderBottom="1px"
              borderColor="gray.700"
              _hover={{ bg: 'gray.800' }}
              transition="background-color 0.2s"
            >
              <Box
                as={RouterLink}
                to={`/recipe/${r.slug}`}
                fontSize="lg"
                fontWeight="medium"
                color="blue.400"
                _hover={{ color: 'blue.300', textDecoration: 'none' }}
                display="inline-block"
              >
                {r.title}
              </Box>
              {r.tags.length > 0 && (
                <Flex mt={2} gap={2} flexWrap="wrap">
                  {r.tags.map(tag => (
                    <Tag
                      key={tag}
                      size="sm"
                      variant="subtle"
                      bg="gray.700"
                      color="gray.300"
                    >
                      #{tag}
                    </Tag>
                  ))}
                </Flex>
              )}
            </Box>
          ))}
        </Box>
      </VStack>
    </Container>
  );
}