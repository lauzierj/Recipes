import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  Grid,
  AspectRatio,
} from '@chakra-ui/react';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  description?: string;
  packageFolder?: string;
  firstImage?: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);

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

          // Extract first image from content
          let firstImage = '';
          if (recipe.packageFolder) {
            const imageMatch = recipe.content.match(/!\[([^\]]*)\]\(([-\w]+\.(webp|jpeg|jpg|png|gif))\)/i);
            if (imageMatch) {
              const encodedFolderName = encodeURIComponent(recipe.packageFolder).replace(/%20/g, '%20');
              firstImage = `${base}recipes/${encodedFolderName}/Photos/${imageMatch[2]}`;
            }
          }

          return { ...recipe, description, firstImage };
        });
        setRecipes(recipesWithDescription);

        // Get 11 random recipes with photos for the landing page
        // (1 hero recipe + 10 in 2-column grid = 5 complete rows)
        const recipesWithPhotos = recipesWithDescription.filter(r => r.firstImage && r.description);
        const randomFeatured = [...recipesWithPhotos]
          .sort(() => Math.random() - 0.5)
          .slice(0, 11);
        setFeaturedRecipes(randomFeatured);

        // Count tag frequencies and sort by frequency
        const tagFrequency = new Map<string, number>();
        recipesWithDescription.forEach(recipe => {
          recipe.tags.forEach(tag => {
            tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
          });
        });

        // Sort tags by frequency (descending)
        const sortedTags = Array.from(tagFrequency.keys()).sort((a, b) => {
          const freqDiff = tagFrequency.get(b)! - tagFrequency.get(a)!;
          if (freqDiff !== 0) return freqDiff;
          return a.localeCompare(b); // Alphabetical if same frequency
        });

        setTags(sortedTags);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tagFilter) params.set('tag', tagFilter);
    setSearchParams(params);
  }, [query, tagFilter, setSearchParams]);

  // Measure tag buttons to determine the collapsed height (2 rows + padding)
  useEffect(() => {
    const parseSizeValue = (value: string | null) => {
      if (!value) return 0;
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const updateMeasurements = () => {
      const container = tagContainerRef.current;
      if (!container) {
        setCollapsedHeight(null);
        setIsOverflowing(false);
        return;
      }

      const firstButton = container.querySelector('button');
      if (!firstButton) {
        setCollapsedHeight(null);
        setIsOverflowing(false);
        return;
      }

      const style = window.getComputedStyle(container);
      const paddingTop = parseSizeValue(style.paddingTop);
      const paddingBottom = parseSizeValue(style.paddingBottom);
      const rowGapRaw = style.rowGap && style.rowGap !== 'normal' ? style.rowGap : '';
      const gapRaw = style.gap && style.gap !== 'normal' ? style.gap : '';
      const rowGap = parseSizeValue(rowGapRaw || gapRaw);
      const buttonHeight = firstButton.getBoundingClientRect().height;

      if (buttonHeight === 0) {
        setIsOverflowing(false);
        return;
      }

      const desiredHeight = Math.ceil(buttonHeight * 2 + paddingTop + paddingBottom + rowGap);

      setCollapsedHeight(prev => (prev === null || prev !== desiredHeight ? desiredHeight : prev));
      setIsOverflowing(container.scrollHeight - desiredHeight > 1);
    };

    updateMeasurements();

    window.addEventListener('resize', updateMeasurements);

    const resizeObserver = new ResizeObserver(updateMeasurements);
    if (tagContainerRef.current) {
      resizeObserver.observe(tagContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateMeasurements);
      resizeObserver.disconnect();
    };
  }, [tags]);

  const filtered = recipes.filter(r =>
    (!tagFilter || r.tags.includes(tagFilter)) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.content.toLowerCase().includes(query.toLowerCase()))
  );

  const isLandingPage = !query && !tagFilter;

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
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
          <Box position="relative">
            <Flex
              ref={tagContainerRef}
              gap={2}
              flexWrap="wrap"
              maxH={
                showAllTags
                  ? 'none'
                  : collapsedHeight !== null
                    ? `${collapsedHeight}px`
                    : undefined
              }
              overflow={showAllTags ? 'visible' : 'hidden'}
              pb={2}
            >
              <Button
                size="sm"
                variant={tagFilter === '' ? 'solid' : 'outline'}
                colorScheme={tagFilter === '' ? 'blue' : undefined}
                onClick={() => setTagFilter('')}
                borderColor="gray.600"
                color={tagFilter === '' ? 'white' : 'gray.200'}
                bg={tagFilter === '' ? 'blue.600' : 'transparent'}
                _hover={{
                  bg: tagFilter === '' ? 'blue.700' : 'gray.700',
                  color: 'white'
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
                  borderColor="gray.600"
                  color={tagFilter === t ? 'white' : 'gray.200'}
                  bg={tagFilter === t ? 'blue.600' : 'transparent'}
                  _hover={{
                    bg: tagFilter === t ? 'blue.700' : 'gray.700',
                    color: 'white'
                  }}
                >
                  #{t}
                </Button>
              ))}
            </Flex>
            {isOverflowing && (
              <Button
                size="sm"
                variant="ghost"
                color="blue.400"
                onClick={() => setShowAllTags(!showAllTags)}
                mt={2}
                _hover={{ bg: 'gray.700' }}
              >
                {showAllTags ? 'Show less' : 'More...'}
              </Button>
            )}
          </Box>
        </Box>

        {tagFilter && (
          <Box bg="gray.800" borderRadius="md" p={4}>
            <Text>
              Showing recipes tagged with <Text as="span" fontWeight="bold">#{tagFilter}</Text>
            </Text>
          </Box>
        )}

        {isLandingPage ? (
          // Landing page: Show featured recipes in a news-style grid
          <Box>
            <Heading size="lg" mb={6} color="gray.200">Featured Recipes</Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {featuredRecipes.map((recipe, index) => (
                <Box
                  key={recipe.slug}
                  as={RouterLink}
                  to={`/recipe/${recipe.slug}`}
                  display="block"
                  _hover={{ textDecoration: 'none' }}
                  role="group"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="gray.800"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _groupHover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                  gridColumn={index === 0 ? { md: 'span 2' } : undefined}
                >
                  {recipe.firstImage && (
                    <AspectRatio ratio={index === 0 ? 21 / 9 : 16 / 9}>
                      <Image
                        src={recipe.firstImage}
                        alt={recipe.title}
                        objectFit="cover"
                        loading="lazy"
                      />
                    </AspectRatio>
                  )}
                  <Box p={4}>
                    <Heading
                      size={index === 0 ? 'lg' : 'md'}
                      mb={2}
                      color="gray.100"
                      _groupHover={{ color: 'blue.400' }}
                      transition="color 0.2s"
                    >
                      {recipe.title}
                    </Heading>
                    {recipe.description && (
                      <Text
                        fontSize={index === 0 ? 'md' : 'sm'}
                        color="gray.400"
                        noOfLines={index === 0 ? 3 : 2}
                      >
                        {recipe.description}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        ) : (
          // Search/filter results: Show all recipes in list format
          <VStack align="stretch" gap={0}>
            {filtered.map(r => (
            <Box
              key={r.slug}
              as={RouterLink}
              to={`/recipe/${r.slug}`}
              p={4}
              borderBottom="1px"
              borderColor="gray.700"
              _hover={{ bg: 'gray.800', textDecoration: 'none' }}
              transition="background-color 0.2s"
              cursor="pointer"
              display="block"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="blue.400"
                mb={1}
              >
                {r.title}
              </Text>
              {r.description && (
                <Text
                  fontSize="sm"
                  color="gray.400"
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
                      background: 'var(--chakra-colors-gray-600)',
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
                        bg="gray.700"
                        color="gray.300"
                        cursor="pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTagFilter(tag);
                        }}
                        _hover={{ bg: 'gray.600', color: 'gray.200' }}
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
        )}
      </VStack>
    </Container>
  );
}