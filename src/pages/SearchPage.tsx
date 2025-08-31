import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Input,
  HStack,
  Button,
  Badge,
  VStack,
  Text,
  Link as ChakraLink,
  Flex,
  Card,
  CardBody
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
    <Container maxW="container.lg" py={8}>
      <VStack align="stretch" gap={6}>
        <Heading size="2xl" color="fg">Recipes</Heading>
        
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          size="lg"
          bg="bg.subtle"
          borderColor="border"
          _hover={{ borderColor: "border.subtle" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
        />

        <Box>
          <Text fontWeight="semibold" mb={3} color="fg">Filter by tag:</Text>
          <Flex wrap="wrap" gap={2}>
            <Button
              size="sm"
              variant={tagFilter === '' ? 'solid' : 'outline'}
              colorPalette={tagFilter === '' ? 'blue' : 'gray'}
              onClick={() => setTagFilter('')}
            >
              All
            </Button>
            {tags.map(t => (
              <Button
                key={t}
                size="sm"
                variant={tagFilter === t ? 'solid' : 'outline'}
                colorPalette={tagFilter === t ? 'blue' : 'gray'}
                onClick={() => setTagFilter(t)}
              >
                #{t}
              </Button>
            ))}
          </Flex>
        </Box>

        {tagFilter && (
          <Card bg="blue.900/20" borderColor="blue.500/30" borderWidth="1px">
            <CardBody>
              <Text color="fg">
                Showing recipes tagged with <Text as="span" fontWeight="bold">#{tagFilter}</Text>
              </Text>
            </CardBody>
          </Card>
        )}

        <VStack align="stretch" gap={2}>
          {filtered.map(r => (
            <Card
              key={r.slug}
              variant="subtle"
              bg="bg.subtle"
              _hover={{ bg: "bg.muted" }}
              transition="all 0.2s"
            >
              <CardBody>
                <ChakraLink asChild _hover={{ textDecoration: 'none' }}>
                  <Link to={`/recipe/${r.slug}`}>
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color="blue.400"
                      mb={2}
                    >
                      {r.title}
                    </Text>
                  </Link>
                </ChakraLink>
                {r.tags.length > 0 && (
                  <HStack wrap="wrap" gap={2}>
                    {r.tags.map(tag => (
                      <Badge
                        key={tag}
                        colorPalette="gray"
                        variant="subtle"
                        size="sm"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </HStack>
                )}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}
