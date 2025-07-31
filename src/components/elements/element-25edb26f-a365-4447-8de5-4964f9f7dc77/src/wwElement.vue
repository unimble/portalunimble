<template>
    <form
        :name="content.name"
        :autocomplete="content.autocomplete ? 'on' : 'off'"
        class="ww-form-container"
        :class="[formState, { editing: isEditing, selected: isSelected }]"
        data-ww-flag="form-container"
        @submit.prevent="submit"
    >
        <wwLink v-show="false" ref="link" :ww-link="content.afterSubmitAction.link" />

        <div class="ww-form-container__relative">
            <wwLayout
                :class="{ hidden: formState === 'success' }"
                class="ww-form-container__content -normal"
                path="content"
            />
            <wwLayout
                :class="{ hidden: formState !== 'success' }"
                class="ww-form-container__content -success"
                path="successContent"
            />
            <wwLayout v-if="formState === 'error'" class="ww-form-container__content -error" path="errorContent" />
        </div>

    </form>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
    },
    emits: ['update:sidepanel-content', 'update:content:effect', 'trigger-event'],
    data() {
        return {
            designName: wwLib.wwWebsiteData.getWebsiteName(),
            state: 'normal',
            remountKey: 0,
            designId: wwLib.wwWebsiteData.getInfo().id,
            apiUrl: wwLib.wwApiRequests._getApiUrl(),
        };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isSelected() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        formState() {
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return this.state;
            /* wwFront:end */
        },
    },
    methods: {
        setState(state) {
            /* wwFront:start */
            this.state = state;
            /* wwFront:end */
        },
        getComputedData(data) {
            switch (this.content.submitAction) {
                case 'weweb-email':
                    return {
                        designName: this.designName,
                        recipients: this.content.wewebEmail.recipients,
                        ...data,
                    };
                case 'airtable':
                    return { records: [{ fields: data }] };
                default:
                    return data;
            }
        },
        async submit(form) {
            try {

                if (this.formState === 'success' || this.formState === 'loading') return;

                if (this.content.submitAction !== 'none') this.setState('loading');

                // INIT DATA
                const data = {};

                // ADD DATA REQUEST
                for (const elem of form.srcElement.elements) {
                    if (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA' || elem.nodeName === 'SELECT') {
                        switch (elem.type) {
                            case 'number':
                                data[elem.name] = parseFloat(elem.value);
                                break;
                            case 'date':
                                data[elem.name] = new Date(elem.value).toUTCString();
                                break;
                            case 'checkbox':
                                data[elem.name] = elem.value === 'on' ? true : false;
                                break;
                            case 'radio':
                                data[elem.name] = elem.checked ? elem.value : data[elem.name];
                                break;
                            default:
                                data[elem.name] = elem.value;
                                break;
                        }
                    }

                    if (
                        elem.classList.contains('g-recaptcha-response') &&
                        wwLib.getFrontWindow().grecaptcha.getResponse() === ''
                    ) {
                        const errorMessage = wwLib.getFrontDocument().createElement('p');
                        errorMessage.innerHTML = 'Invalid reCAPTCHA. Please try again';
                        errorMessage.style.color = '#ff0000';
                        errorMessage.style.fontSize = '12px';
                        elem.parentNode.appendChild(errorMessage);

                        setTimeout(() => {
                            elem.parentNode.removeChild(errorMessage);
                        }, 8000);
                        throw new Error();
                    }
                }

                // ADD QUERY VAR
                for (const query of this.content.queries) {
                    const value = this.$route.query[query];
                    if (value) data[query] = value;
                }

                const headers = this.content.headers.reduce((headersObj, elem) => {
                    return { ...headersObj, [elem.key]: elem.value };
                }, {});

                const formData = {
                    ...this.content.data.reduce((dataObj, elem) => {
                        return { ...dataObj, [elem.key]: elem.value };
                    }, {}),
                    ...this.getComputedData(data),
                };

                // REQUEST
                if (this.content.submitAction !== 'none') {
                    await axios({
                        method: this.content.method,
                        url:
                            this.content.submitAction === 'weweb-email'
                                ? `${this.apiUrl}/design/${this.designId}/form/email`
                                : this.content.url,
                        data: formData,
                        headers,
                    });
                }

                this.$emit('trigger-event', { name: 'submit', event: { formData } });
                this.afterSubmitAction();

                // CHANGE STATUS
                if (this.content.submitAction !== 'none') this.setState('success');
            } catch (err) {
                // CHANGE STATUS
                this.setState('error');

                this.$emit('trigger-event', { name: 'submit-error', event: { formError: err } });
                this.afterErrorAction();

                wwLib.wwLog.error(err);
            }
        },
        async afterSubmitAction() {
            switch (this.content.afterSubmitAction.type) {
                case 'link':
                    return this.$refs.link.$el.click();
                case 'custom-script': {
                    const scriptFunction = new Function(this.content.afterSubmitAction.customScript.code);
                    return scriptFunction();
                }
            }
        },
        async afterErrorAction() {
            switch (this.content.afterErrorAction.type) {
                case 'link':
                    return this.$refs.link.$el.click();
                case 'custom-script': {
                    const scriptFunction = new Function(this.content.afterErrorAction.customScript.code);
                    return scriptFunction();
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-form-container {
    box-sizing: border-box;
    &.loading {
        button[type='submit'] {
            pointer-events: none;
        }
    }
    &__relative {
        position: relative;
    }
    &__content {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: stretch;
        &.-normal {
            transition: all 0.3s ease;
            transition-delay: 0.3s;
            &.hidden {
                opacity: 0;
                visibility: hidden;
                transition-delay: 0s;
            }
        }
        &.-success {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.3s ease;
            transition-delay: 0.3s;
            &.hidden {
                opacity: 0;
                transition-delay: 0s;
                visibility: hidden;
            }
        }
    }
}
</style>
