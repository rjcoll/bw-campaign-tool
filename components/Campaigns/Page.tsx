'use client';

import useFirestoreDoc from '@/hooks/useFirestoreDoc';
import useFirestoreCollection from '@/hooks/useFirestoreCollection';
import { where } from 'firebase/firestore';
import { Container, Flex, Box, Heading, Text } from '@radix-ui/themes';
import SignInWrapper from '@/components/SignInWrapper';
import { useParams } from 'next/navigation';
import GoalList from '@/components/Goals/List';
import AddAction from '@/components/Actions/Add';
import ActionList from '@/components/Actions/List';
import { auth } from '@/helpers/firebase';
import ReactMarkdown from 'react-markdown';
import Edit from '@/components/Campaigns/Edit';
import StatusBadge from '@/components/StatusBadge';
import AddDocument from '@/components/Documents/Add';
import DocumentList from '@/components/Documents/List';

const Page = () => {
  const { id }: { id: string } = useParams();
  const { data: campaign, loading } = useFirestoreDoc<Campaign>(
    `campaigns/${id}`,
    true,
  );

  //add query parameters here (e.g. where tag field contains Id)
  const { data: documents, loading: loadingDocuments } =
    useFirestoreCollection<MediaRecord>(
      'media',
      true,
      where('tags', 'array-contains', id),
    );

  const user = auth.currentUser;

  return (
    <SignInWrapper
      force
      loading={loading}
      breadcrumbs={[
        {
          label: 'Campaigns',
          href: '/campaigns',
        },
        {
          label: loading ? 'Loading...' : campaign?.name,
        },
      ]}
    >
      <Container size="3">
        <Flex direction="row" align="center" gap="2" mt="8">
          <Heading>{campaign?.name}</Heading>

          <Box flexGrow="1" />
          <StatusBadge status={campaign?.status} />

          <Edit
            ml="auto"
            docId={campaign?.id}
            variant="outline"
            color="green"
            size="1"
            loading={loading}
          >
            Edit campaign
          </Edit>
        </Flex>

        <Flex
          direction={{ initial: 'column', md: 'row' }} // Stacks on narrow viewports, side-by-side on large viewports
          wrap="nowrap"
          gap="4"
          mt="4"
        >
          <Flex
            flexGrow={'1'}
            wrap="nowrap"
            direction="column"
            maxWidth={{ initial: '100%', md: '60%' }}
            /// Full width when stacked, takes two-thirds on large viewports
          >
            <Box mb="4">
              <Heading size="4">Background</Heading>
              <ReactMarkdown>
                {campaign?.description ||
                  "No information available - select 'edit campaign' to add more details"}
              </ReactMarkdown>
            </Box>
            {/* hide this box if campaign.contribution is null*/}
            {campaign?.contribution && (
              <Box>
                <Heading size="4">How can you help?</Heading>
                <ReactMarkdown>{campaign?.contribution}</ReactMarkdown>
              </Box>
            )}
          </Flex>

          <Box flexShrink={'5'} flexGrow={'5'} mb="4">
            <GoalList goals={campaign?.goals} loading={loading} docId={id} />
          </Box>
        </Flex>
        <Box
          p="2"
          style={{
            backgroundColor: 'var(--accent-2)',
            borderRadius: 'var(--radius-4)',
          }}
        >
          <Flex direction="row" justify="center">
            <Heading size="4">Actions</Heading>
            <Box flexGrow="1" />
          </Flex>
          <Flex direction="row" mt="2">
            <ActionList />
          </Flex>
          <Box>
            <AddAction
              size="1"
              mt="2"
              campaign={{ id: id, name: campaign?.name }}
              user={{
                id: user?.uid,
                name: user?.displayName,
                email: user?.email,
              }}
            >
              Add action
            </AddAction>
          </Box>
        </Box>

        <Box p="2">
          <Flex direction="row" justify="center">
            <Heading size="4">Relevant documents</Heading>
            <Box flexGrow="1" />
          </Flex>
          {(documents.length > 0 && (
            <DocumentList documents={documents} loading={loadingDocuments} />
          )) || <Text size="1">No documents available</Text>}

          <AddDocument tags={['bw-campaign-tool', id]} />
        </Box>
      </Container>
    </SignInWrapper>
  );
};

export default Page;
