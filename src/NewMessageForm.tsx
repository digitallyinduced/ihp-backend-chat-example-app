import React, { useState, useCallback } from 'react';

import { query, createRecord, UUID, loginWithRedirect } from 'thin-backend';
import { useQuerySingleResult } from 'thin-backend/react';


interface NewMessageFormProps {
    channelId: UUID
}
export function NewMessageForm({ channelId }: NewMessageFormProps) {
    const [body, setBody] = useState("");
    const channel = useQuerySingleResult(query('channels').filterWhere('id', channelId));

    const onChange = useCallback((event) => {
        setBody(event.target.value);
    }, [setBody]);

    const handleForm = useCallback((event) => {
        event?.preventDefault();
        
        createRecord('messages', { body, channelId });
        setBody('');
    }, [body, channelId]);

    return <form className="form-inline d-flex" onSubmit={handleForm}>
        <input
            type="text"
            className="form-control flex-grow-1"
            id="newMessageBody"
            placeholder={"Send Message to " + channel?.name}
            value={body}
            onChange={onChange}
        />
        <button className="btn btn-primary">Send</button>
    </form>
}

export function NewMessageFormIfLoggedOut() {
    const [isLoading, setLoading] = useState(false);
    const login = () => {
        setLoading(true);
        loginWithRedirect();
    };

    return <div className="text-muted text-center">
        <p>You need to be logged in to write a message.</p>
        <button className="btn btn-primary ml-auto" onClick={login} disabled={isLoading}>Login to Chat</button>
    </div>
}