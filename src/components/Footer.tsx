import React, { useEffect, useState } from 'react';
import { Box, Text, Container } from '@chakra-ui/react';

interface BuildInfo {
  timestamp: string;
  date: string;
}

export default function Footer() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}build-info.json`)
      .then(r => r.json())
      .then((info: BuildInfo) => setBuildInfo(info))
      .catch(() => {
        setBuildInfo({
          timestamp: 'development',
          date: 'Development Build'
        });
      });
  }, []);

  if (!buildInfo) return null;

  return (
    <Box as="footer" mt="auto" py={4} borderTop="1px" borderColor="gray.200">
      <Container maxW="container.lg">
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Built: {buildInfo.date}
        </Text>
      </Container>
    </Box>
  );
}