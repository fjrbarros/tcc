import React from 'react';

export default function Form(props) {
    const { onSubmit, ...formProps } = props;

    function handleSubmit(event) {
        event.preventDefault();

        if (onSubmit) onSubmit(event);
    }

    return (
        <form
            noValidate={true}
            onSubmit={handleSubmit}
            {...formProps}
        />
    );
}