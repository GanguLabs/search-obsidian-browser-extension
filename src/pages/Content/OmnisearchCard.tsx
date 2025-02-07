import React, { useEffect, useState } from 'react';
import { UserConfig } from '../../config';
import { Link, Card, CardHeader, CardBody, Text, Box } from '@chakra-ui/react';

interface Props {
  userConfig: UserConfig;
  query: string;
}

interface OmnisearchResult {
  score: number;
  path: string;
  basename: string;
  foundWords: string[];
  matches: {
    match: string;
    offset: number; // TODO: Add highlight on the match
  }[];
  excerpt: string;
}

export function OmnisearchCard(props: Props) {
  const [omnisearchResults, setOmnisearchResults] = useState<
    OmnisearchResult[] | []
  >([]);

  useEffect(() => {
    async function OmnisearchQuery(props: Props) {
      const port = props.userConfig.port;
      const token = props.userConfig.token;

      const res = await fetch(
        `http://localhost:${port}/omnisearch/?q=${props.query}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      console.log("Obsidian search results", {json})
      setOmnisearchResults(json);
    }
    OmnisearchQuery(props);
  }, [props]);

  if (omnisearchResults.length === 0) {
    return null;
  }

  const topThreeOmnisearchResults = omnisearchResults.slice(0, 3);
  return (
    <Box>
      {topThreeOmnisearchResults.map((result, idx) => {
        const vaultName = props.userConfig.vaultName;
        const filename = result.basename;
        const url = `obsidian://open?vault=${vaultName}&file=${filename}`;

        return (
          <Card key={idx}>
            <CardHeader pb="0" pl="2px" pt="12px">
              <Text as="b" fontSize="2xl">
                <Link href={url} isExternal>
                  {result.basename}.md
                </Link>
              </Text>
            </CardHeader>
            <CardBody>
              <Box>
                <Text
                  mt="2px"
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  // TODO: Some may have trouble seeing the excerpt
                  // TODO: Add highlight on the match
                  // TODO: Maybe unsafe to use dangerouslySetInnerHTML
                />
              </Box>
            </CardBody>
          </Card>
        );
      })}
    </Box>
  );
}
