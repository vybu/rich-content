/*
 *  The converter functions convert different plugin entities to a common structure objects, accordingly to media type.
 *  every converter function signature:
 *  entity => [ { type, ...specificMediaData } ]
 * */
const defaultEntityConverter = () => [];

/*
 * wix-draft-plugin-image data format:
 *
 * {
 *  src: { width, height, file_name },
 * }
 *
 *
 * wix-draft-plugin-gallery image data format:
 *
 * {
 *  items: [
 *    { metadata: { height, width }, url },
 *  ]
 * }
 *
 *
 * common representation:
 *
 * { width, height, url, type: 'image', thumbnail? }
 * */
const imageConverter = entity => [
  {
    width: entity.data.src.width,
    height: entity.data.src.height,
    url: entity.data.src.file_name,
    type: 'image',
    metadata: entity.data.metadata,
    link: entity.data.config.link,
  },
];

const galleryConverter = entity =>
  entity.data.items.map(({ metadata, url }) => ({
    url,
    height: metadata.height,
    width: metadata.width,
    type: 'image',
  }));

const giphyConverter = entity => [
  {
    type: 'image',
    url: entity.data.gif.originalUrl,
    thumbnail: entity.data.gif.stillUrl,
    width: entity.data.gif.width,
    height: entity.data.gif.height,
  },
];

/*
 * wix-draft-plugin-video, wix-draft-plugin-sound-cloud data format:
 * { src: 'url_string' }
 *
 * common representation:
 *
 * { url, type: 'video', thumbnail? }
 *
 */

const videoConverter = entity => [
  {
    type: 'video',
    url: entity.data.src,
    isCustom: entity.data.isCustomVideo,
  },
];

const fileConverter = entity => [
  {
    name: entity.data.name,
    type: 'file',
    fileType: entity.data.type,
    url: entity.data.url,
  },
];

const mapConverter = entity => [
  {
    type: 'map',
    mapSettings: entity.data.mapSettings,
  },
];

const converters = {
  'wix-draft-plugin-image': imageConverter,
  'wix-draft-plugin-gallery': galleryConverter,
  'wix-draft-plugin-divider': defaultEntityConverter,
  'wix-draft-plugin-video': videoConverter,
  'wix-draft-plugin-sound-cloud': videoConverter,
  'wix-draft-plugin-giphy': giphyConverter,
  'wix-draft-plugin-file-upload': fileConverter,
  'wix-draft-plugin-map': mapConverter,
  mention: defaultEntityConverter,
  'wix-draft-plugin-headers-markdown': defaultEntityConverter,
  'wix-draft-plugin-button': defaultEntityConverter,
  LINK: defaultEntityConverter,
  'wix-draft-plugin-html': defaultEntityConverter,
};

const extractEntityData = entity => converters[entity.type](entity);

export default extractEntityData;
