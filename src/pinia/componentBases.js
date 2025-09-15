import { defineStore } from 'pinia';
import { getInheritedConfiguration } from '@/_common/helpers/configuration/configuration';
 
/* wwFront:start */
import plugin832d6f7a42c343f1a3ce9a678272f811 from '@/components/plugins/plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811/ww-config.js';
import plugin1fa0dd685069436c9a7d3b54c340f1fa from '@/components/plugins/plugin-1fa0dd68-5069-436c-9a7d-3b54c340f1fa/ww-config.js';
import pluginf9ef41c31c534857855bf2f6a40b7186 from '@/components/plugins/plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186/ww-config.js';
import plugin2bd1c68831c5443eae2559aa5b6431fb from '@/components/plugins/plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb/ww-config.js';
import plugin97e7b1aef88a4697849cee56ab49bb48 from '@/components/plugins/plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48/ww-config.js';
import plugin9c40819b4a8f468f9ba54b9699f3361f from '@/components/plugins/plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f/ww-config.js';
import section99586bd32b154d6ba0256a50d07ca845 from '@/components/sections/section-99586bd3-2b15-4d6b-a025-6a50d07ca845/ww-config.js';
import sectionef0ecc719a594eab94b0b36d66d3d61d from '@/components/sections/section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d/ww-config.js';
import wwobjectaeb78b9a6fb64c49931dfaedcfad67ba from '@/components/elements/element-aeb78b9a-6fb6-4c49-931d-faedcfad67ba/ww-config.js';
import wwobjectfd8c482f532c4aeba7ae6904a6b62a1b from '@/components/elements/element-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b/ww-config.js';
import wwobject70a5385853ca40a5ad88c1cd33b5cc9f from '@/components/elements/element-70a53858-53ca-40a5-ad88-c1cd33b5cc9f/ww-config.js';
import wwobject99ea5bf7b91e43ea8ec3dbaf2b171e34 from '@/components/elements/element-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34/ww-config.js';
import wwobject0d3e75d19e7744cba2728b0825fbc5da from '@/components/elements/element-0d3e75d1-9e77-44cb-a272-8b0825fbc5da/ww-config.js';
import wwobject69d0b3efb265494c8cd1874da4aa1834 from '@/components/elements/element-69d0b3ef-b265-494c-8cd1-874da4aa1834/ww-config.js';
import wwobject83d890fb84f94386b459fb4be89a8e15 from '@/components/elements/element-83d890fb-84f9-4386-b459-fb4be89a8e15/ww-config.js';
import wwobject6ba133b6a444414f93a525cd237dd398 from '@/components/elements/element-6ba133b6-a444-414f-93a5-25cd237dd398/ww-config.js';
import wwobjectaf811adf94d949ddab22e2f29ae30299 from '@/components/elements/element-af811adf-94d9-49dd-ab22-e2f29ae30299/ww-config.js';
import wwobject6f8796b18273498d95fc7013b7c63214 from '@/components/elements/element-6f8796b1-8273-498d-95fc-7013b7c63214/ww-config.js';
import wwobject88ef76b646d54685878f2f1fa0d54cb8 from '@/components/elements/element-88ef76b6-46d5-4685-878f-2f1fa0d54cb8/ww-config.js';
import wwobject9256b033f4e84ab4adcedac3a940d7f5 from '@/components/elements/element-9256b033-f4e8-4ab4-adce-dac3a940d7f5/ww-config.js';
import wwobject61825dc396de46e1a8c4b091289d8448 from '@/components/elements/element-61825dc3-96de-46e1-a8c4-b091289d8448/ww-config.js';
import wwobjectd7904e9dfc9a4d809e32728e097879ad from '@/components/elements/element-d7904e9d-fc9a-4d80-9e32-728e097879ad/ww-config.js';
import wwobject7179ba70c5d749a59828f85704fd1efc from '@/components/elements/element-7179ba70-c5d7-49a5-9828-f85704fd1efc/ww-config.js';
import wwobjectaa27b26f06864c2998c58217044045b7 from '@/components/elements/element-aa27b26f-0686-4c29-98c5-8217044045b7/ww-config.js';
import wwobject2dff59573bd846f9afa3a5c5bab91931 from '@/components/elements/element-2dff5957-3bd8-46f9-afa3-a5c5bab91931/ww-config.js';
import wwobject3a7d637912d3438798ffb332bb492a63 from '@/components/elements/element-3a7d6379-12d3-4387-98ff-b332bb492a63/ww-config.js';
import wwobjectb783dc65d5284f748c14e27c934c39b1 from '@/components/elements/element-b783dc65-d528-4f74-8c14-e27c934c39b1/ww-config.js';
import wwobject14723a2101784d92a7e9d1dfeaec29a7 from '@/components/elements/element-14723a21-0178-4d92-a7e9-d1dfeaec29a7/ww-config.js';
import wwobjectf4c24d06bc884b62add34d1f8b42221c from '@/components/elements/element-f4c24d06-bc88-4b62-add3-4d1f8b42221c/ww-config.js';
import wwobject53401515b6944c79a88dabeecb1de562 from '@/components/elements/element-53401515-b694-4c79-a88d-abeecb1de562/ww-config.js';
import wwobject18998884a7574a8780fe44f129cf0962 from '@/components/elements/element-18998884-a757-4a87-80fe-44f129cf0962/ww-config.js';
import wwobjectc8199d0db61f464098e0c4be9ea254e0 from '@/components/elements/element-c8199d0d-b61f-4640-98e0-c4be9ea254e0/ww-config.js';
import wwobject5a88036f22ea4f8db4a5bc226ef95061 from '@/components/elements/element-5a88036f-22ea-4f8d-b4a5-bc226ef95061/ww-config.js';
import wwobject1b1e21739b7842cca8eea6167caea340 from '@/components/elements/element-1b1e2173-9b78-42cc-a8ee-a6167caea340/ww-config.js';
import wwobject25edb26fa36544478de54964f9f7dc77 from '@/components/elements/element-25edb26f-a365-4447-8de5-4964f9f7dc77/ww-config.js';
import wwobject6047b8df81b745a7a6b37355fb2fa3cd from '@/components/elements/element-6047b8df-81b7-45a7-a6b3-7355fb2fa3cd/ww-config.js';
import wwobject97a634605c254d74ac1f86693c2e4a08 from '@/components/elements/element-97a63460-5c25-4d74-ac1f-86693c2e4a08/ww-config.js';
import wwobjectaa29a66107ce484e8abb456186211282 from '@/components/elements/element-aa29a661-07ce-484e-8abb-456186211282/ww-config.js';
import wwobject57831abf83ad49adba973bd30b035710 from '@/components/elements/element-57831abf-83ad-49ad-ba97-3bd30b035710/ww-config.js';
import wwobject59dca300db7842e4a7a60cbf22d3cc82 from '@/components/elements/element-59dca300-db78-42e4-a7a6-0cbf22d3cc82/ww-config.js';
import wwobject1ba25bdfdee94e0ea0b8b3f3128c3b65 from '@/components/elements/element-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65/ww-config.js';
import wwobjectd2eeb897ad9549e48394fe3f5c9a81fb from '@/components/elements/element-d2eeb897-ad95-49e4-8394-fe3f5c9a81fb/ww-config.js';
import wwobject9ecb2cfccef74be8b7363e17a3b7e9ff from '@/components/elements/element-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff/ww-config.js';
import wwobject6145eb600af84e52bcc6dc0f6743654e from '@/components/elements/element-6145eb60-0af8-4e52-bcc6-dc0f6743654e/ww-config.js';
import wwobjectdeb10a015eef4aa190171b51c2ad6fd0 from '@/components/elements/element-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0/ww-config.js';
import wwobject985570fcb3c04566800482ab3b30a11d from '@/components/elements/element-985570fc-b3c0-4566-8004-82ab3b30a11d/ww-config.js';
import wwobjecta823467cbdc74ceca38c71875c4c214a from '@/components/elements/element-a823467c-bdc7-4cec-a38c-71875c4c214a/ww-config.js';
import wwobjectbf59c8e714c94c03a7398bd7d14031a4 from '@/components/elements/element-bf59c8e7-14c9-4c03-a739-8bd7d14031a4/ww-config.js';
import wwobject9ae1fce82e314bfda4d20450235bdfd5 from '@/components/elements/element-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5/ww-config.js';
/* wwFront:end */

export const useComponentBasesStore = defineStore('componentBases', () => {
    let configurations;
    /* wwFront:start */
    // eslint-disable-next-line no-undef
    configurations = {'plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811': getInheritedConfiguration({ ...plugin832d6f7a42c343f1a3ce9a678272f811, name: 'plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811' }),
'plugin-1fa0dd68-5069-436c-9a7d-3b54c340f1fa': getInheritedConfiguration({ ...plugin1fa0dd685069436c9a7d3b54c340f1fa, name: 'plugin-1fa0dd68-5069-436c-9a7d-3b54c340f1fa' }),
'plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186': getInheritedConfiguration({ ...pluginf9ef41c31c534857855bf2f6a40b7186, name: 'plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186' }),
'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb': getInheritedConfiguration({ ...plugin2bd1c68831c5443eae2559aa5b6431fb, name: 'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb' }),
'plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48': getInheritedConfiguration({ ...plugin97e7b1aef88a4697849cee56ab49bb48, name: 'plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48' }),
'plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f': getInheritedConfiguration({ ...plugin9c40819b4a8f468f9ba54b9699f3361f, name: 'plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f' }),
'section-99586bd3-2b15-4d6b-a025-6a50d07ca845': getInheritedConfiguration({ ...section99586bd32b154d6ba0256a50d07ca845, name: 'section-99586bd3-2b15-4d6b-a025-6a50d07ca845' }),
'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d': getInheritedConfiguration({ ...sectionef0ecc719a594eab94b0b36d66d3d61d, name: 'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d' }),
'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba': getInheritedConfiguration({ ...wwobjectaeb78b9a6fb64c49931dfaedcfad67ba, name: 'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba' }),
'wwobject-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b': getInheritedConfiguration({ ...wwobjectfd8c482f532c4aeba7ae6904a6b62a1b, name: 'wwobject-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b' }),
'wwobject-70a53858-53ca-40a5-ad88-c1cd33b5cc9f': getInheritedConfiguration({ ...wwobject70a5385853ca40a5ad88c1cd33b5cc9f, name: 'wwobject-70a53858-53ca-40a5-ad88-c1cd33b5cc9f' }),
'wwobject-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34': getInheritedConfiguration({ ...wwobject99ea5bf7b91e43ea8ec3dbaf2b171e34, name: 'wwobject-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34' }),
'wwobject-0d3e75d1-9e77-44cb-a272-8b0825fbc5da': getInheritedConfiguration({ ...wwobject0d3e75d19e7744cba2728b0825fbc5da, name: 'wwobject-0d3e75d1-9e77-44cb-a272-8b0825fbc5da' }),
'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834': getInheritedConfiguration({ ...wwobject69d0b3efb265494c8cd1874da4aa1834, name: 'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834' }),
'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15': getInheritedConfiguration({ ...wwobject83d890fb84f94386b459fb4be89a8e15, name: 'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15' }),
'wwobject-6ba133b6-a444-414f-93a5-25cd237dd398': getInheritedConfiguration({ ...wwobject6ba133b6a444414f93a525cd237dd398, name: 'wwobject-6ba133b6-a444-414f-93a5-25cd237dd398' }),
'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299': getInheritedConfiguration({ ...wwobjectaf811adf94d949ddab22e2f29ae30299, name: 'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299' }),
'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214': getInheritedConfiguration({ ...wwobject6f8796b18273498d95fc7013b7c63214, name: 'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214' }),
'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8': getInheritedConfiguration({ ...wwobject88ef76b646d54685878f2f1fa0d54cb8, name: 'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8' }),
'wwobject-9256b033-f4e8-4ab4-adce-dac3a940d7f5': getInheritedConfiguration({ ...wwobject9256b033f4e84ab4adcedac3a940d7f5, name: 'wwobject-9256b033-f4e8-4ab4-adce-dac3a940d7f5' }),
'wwobject-61825dc3-96de-46e1-a8c4-b091289d8448': getInheritedConfiguration({ ...wwobject61825dc396de46e1a8c4b091289d8448, name: 'wwobject-61825dc3-96de-46e1-a8c4-b091289d8448' }),
'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad': getInheritedConfiguration({ ...wwobjectd7904e9dfc9a4d809e32728e097879ad, name: 'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad' }),
'wwobject-7179ba70-c5d7-49a5-9828-f85704fd1efc': getInheritedConfiguration({ ...wwobject7179ba70c5d749a59828f85704fd1efc, name: 'wwobject-7179ba70-c5d7-49a5-9828-f85704fd1efc' }),
'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7': getInheritedConfiguration({ ...wwobjectaa27b26f06864c2998c58217044045b7, name: 'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7' }),
'wwobject-2dff5957-3bd8-46f9-afa3-a5c5bab91931': getInheritedConfiguration({ ...wwobject2dff59573bd846f9afa3a5c5bab91931, name: 'wwobject-2dff5957-3bd8-46f9-afa3-a5c5bab91931' }),
'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63': getInheritedConfiguration({ ...wwobject3a7d637912d3438798ffb332bb492a63, name: 'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63' }),
'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1': getInheritedConfiguration({ ...wwobjectb783dc65d5284f748c14e27c934c39b1, name: 'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1' }),
'wwobject-14723a21-0178-4d92-a7e9-d1dfeaec29a7': getInheritedConfiguration({ ...wwobject14723a2101784d92a7e9d1dfeaec29a7, name: 'wwobject-14723a21-0178-4d92-a7e9-d1dfeaec29a7' }),
'wwobject-f4c24d06-bc88-4b62-add3-4d1f8b42221c': getInheritedConfiguration({ ...wwobjectf4c24d06bc884b62add34d1f8b42221c, name: 'wwobject-f4c24d06-bc88-4b62-add3-4d1f8b42221c' }),
'wwobject-53401515-b694-4c79-a88d-abeecb1de562': getInheritedConfiguration({ ...wwobject53401515b6944c79a88dabeecb1de562, name: 'wwobject-53401515-b694-4c79-a88d-abeecb1de562' }),
'wwobject-18998884-a757-4a87-80fe-44f129cf0962': getInheritedConfiguration({ ...wwobject18998884a7574a8780fe44f129cf0962, name: 'wwobject-18998884-a757-4a87-80fe-44f129cf0962' }),
'wwobject-c8199d0d-b61f-4640-98e0-c4be9ea254e0': getInheritedConfiguration({ ...wwobjectc8199d0db61f464098e0c4be9ea254e0, name: 'wwobject-c8199d0d-b61f-4640-98e0-c4be9ea254e0' }),
'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061': getInheritedConfiguration({ ...wwobject5a88036f22ea4f8db4a5bc226ef95061, name: 'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061' }),
'wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340': getInheritedConfiguration({ ...wwobject1b1e21739b7842cca8eea6167caea340, name: 'wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340' }),
'wwobject-25edb26f-a365-4447-8de5-4964f9f7dc77': getInheritedConfiguration({ ...wwobject25edb26fa36544478de54964f9f7dc77, name: 'wwobject-25edb26f-a365-4447-8de5-4964f9f7dc77' }),
'wwobject-6047b8df-81b7-45a7-a6b3-7355fb2fa3cd': getInheritedConfiguration({ ...wwobject6047b8df81b745a7a6b37355fb2fa3cd, name: 'wwobject-6047b8df-81b7-45a7-a6b3-7355fb2fa3cd' }),
'wwobject-97a63460-5c25-4d74-ac1f-86693c2e4a08': getInheritedConfiguration({ ...wwobject97a634605c254d74ac1f86693c2e4a08, name: 'wwobject-97a63460-5c25-4d74-ac1f-86693c2e4a08' }),
'wwobject-aa29a661-07ce-484e-8abb-456186211282': getInheritedConfiguration({ ...wwobjectaa29a66107ce484e8abb456186211282, name: 'wwobject-aa29a661-07ce-484e-8abb-456186211282' }),
'wwobject-57831abf-83ad-49ad-ba97-3bd30b035710': getInheritedConfiguration({ ...wwobject57831abf83ad49adba973bd30b035710, name: 'wwobject-57831abf-83ad-49ad-ba97-3bd30b035710' }),
'wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82': getInheritedConfiguration({ ...wwobject59dca300db7842e4a7a60cbf22d3cc82, name: 'wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82' }),
'wwobject-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65': getInheritedConfiguration({ ...wwobject1ba25bdfdee94e0ea0b8b3f3128c3b65, name: 'wwobject-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65' }),
'wwobject-d2eeb897-ad95-49e4-8394-fe3f5c9a81fb': getInheritedConfiguration({ ...wwobjectd2eeb897ad9549e48394fe3f5c9a81fb, name: 'wwobject-d2eeb897-ad95-49e4-8394-fe3f5c9a81fb' }),
'wwobject-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff': getInheritedConfiguration({ ...wwobject9ecb2cfccef74be8b7363e17a3b7e9ff, name: 'wwobject-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff' }),
'wwobject-6145eb60-0af8-4e52-bcc6-dc0f6743654e': getInheritedConfiguration({ ...wwobject6145eb600af84e52bcc6dc0f6743654e, name: 'wwobject-6145eb60-0af8-4e52-bcc6-dc0f6743654e' }),
'wwobject-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0': getInheritedConfiguration({ ...wwobjectdeb10a015eef4aa190171b51c2ad6fd0, name: 'wwobject-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0' }),
'wwobject-985570fc-b3c0-4566-8004-82ab3b30a11d': getInheritedConfiguration({ ...wwobject985570fcb3c04566800482ab3b30a11d, name: 'wwobject-985570fc-b3c0-4566-8004-82ab3b30a11d' }),
'wwobject-a823467c-bdc7-4cec-a38c-71875c4c214a': getInheritedConfiguration({ ...wwobjecta823467cbdc74ceca38c71875c4c214a, name: 'wwobject-a823467c-bdc7-4cec-a38c-71875c4c214a' }),
'wwobject-bf59c8e7-14c9-4c03-a739-8bd7d14031a4': getInheritedConfiguration({ ...wwobjectbf59c8e714c94c03a7398bd7d14031a4, name: 'wwobject-bf59c8e7-14c9-4c03-a739-8bd7d14031a4' }),
'wwobject-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5': getInheritedConfiguration({ ...wwobject9ae1fce82e314bfda4d20450235bdfd5, name: 'wwobject-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5' })};
    /* wwFront:end */
 
    return {
        configurations,
     };
});
