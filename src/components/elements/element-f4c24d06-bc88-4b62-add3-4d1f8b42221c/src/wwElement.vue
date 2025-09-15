<template>
    <div
        class="skeleton-loader"
        :class="{
            'skeleton-pulse': content.animationType === 'pulse',
            'skeleton-wave': content.animationType === 'wave',
            'skeleton-shimmer': content.animationType === 'shimmer',
        }"
    ></div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        content: {
            type: Object,
            required: true,
        },
        uid: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.skeleton-loader {
    position: relative;
    overflow: hidden;
}

.skeleton-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-wave {
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: wave 1.5s infinite;
    }
}

.skeleton-shimmer {
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: -150%;
        bottom: 0;
        left: -150%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite linear;
    }
}

@keyframes pulse {
    0% {
        opacity: 0.6;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.6;
    }
}

@keyframes wave {
    100% {
        transform: translateX(100%);
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(100%);
    }
}
</style>
