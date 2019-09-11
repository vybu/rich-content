// @flow
import { TOOLBARS } from 'wix-rich-content-common';
import { getDefault } from '../consts';
import { InsertPluginIcon } from '../icons';

const createInsertButtons /*: CreateInsertButtons */ = ({ helpers, t }) => {
  return [
    {
      type: 'file',
      name: 'Image',
      tooltipText: t('ImagePlugin_InsertButton_Tooltip'),
      toolbars: [TOOLBARS.FOOTER, TOOLBARS.SIDE],
      Icon: InsertPluginIcon,
      componentData: getDefault(),
      helpers,
      t,
    },
  ];
};

export default createInsertButtons;
