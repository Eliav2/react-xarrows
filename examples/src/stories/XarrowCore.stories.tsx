import React from 'react';
import { Meta, Story } from '@storybook/react';
import CustomXarrow from '../../../src/Xarrow/XarrowCore';
import { xarrowPropsType } from '../../../src';

export default {
  title: 'XarrowCore',
  component: CustomXarrow,
} as Meta;

const XarrowCoreTestTemplate = (args) => {
  return (
    <div>
      <div>
        my xarrow
        <br />
        <CustomXarrow />
      </div>
    </div>
  );
};

export const XarrowCoreStory: Story<xarrowPropsType> = (args) => <XarrowCoreTestTemplate {...args} />;
