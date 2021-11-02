import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Resizable, ResizableBox } from 'react-resizable';
import { Rnd } from 'react-rnd';
export default {
  title: 'AnotherStoryStories',
  // component: AnotherStoryStories,
} as Meta;

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  background: '#ccc',
  border: '1px solid black',
  textAlign: 'center',
  padding: '10px',
  boxSizing: 'border box',
  marginBottom: '10px',
  overflow: 'hidden', //important
  position: 'relative',
  margin: '20px',
  resize: 'both', //important
};

const AnotherStoryStoriesTestTemplate = (args) => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}>
      Rnd
    </Rnd>
  );
};

export const AnotherStoryStoriesStory: Story = (args) => <AnotherStoryStoriesTestTemplate {...args} />;
