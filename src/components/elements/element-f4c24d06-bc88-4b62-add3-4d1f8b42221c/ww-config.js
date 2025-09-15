export default {
    editor: {
        label: {
            en: 'Skeleton Loader',
        },
        icon: 'loader',
    },
    properties: {
        animationType: {
            label: { en: 'Animation Type' },
            type: 'TextSelect',
            bindable: true,
            defaultValue: 'wave',
            section: 'settings',
            options: {
                options: [
                    { value: 'wave', label: { en: 'Wave' }, icon: 'animation' },
                    { value: 'pulse', label: { en: 'Pulse' }, icon: 'animation' },
                    { value: 'shimmer', label: { en: 'Shimmer' }, icon: 'animation' },
                ],
            },
        },
    },
};
