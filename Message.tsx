import React, { useCallback } from 'react';

import { query, updateRecord, deleteRecord, Message } from 'ihp-backend';
import { useQuerySingleResult } from 'ihp-backend/react';

interface MessageProps {
    message: Message
}
export default function Message({ message }: MessageProps) {
    const author = useQuerySingleResult(query('users').filterWhere('id', message.userId));

    return <div className="message">
        <img src="https://picsum.photos/64/64" loading="lazy"/>
        <div className="flex-grow-1">
            <div className="header">
                <div className="d-flex align-items-center">
                    <div className="message-author">{author?.name || author?.email}</div>
                    <MessageActions message={message} />
                </div>
                <div className="created-at">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </div>
            </div>
            <div className="message-body">
                {message.body}
            </div>
        </div>
    </div>
}

function MessageActions({ message }: MessageProps) {
    const onDeleteClick = useCallback((event) => {
        event.preventDefault();
        deleteRecord('messages', message.id);
    }, [message.id]);

    const onEditClick = useCallback((event) => {
        event.preventDefault();
        updateRecord('messages', message.id, {
            body: window.prompt('New Message', message.body) || message.body
        })
    }, [message])

    return <div className="actions">
        <a href="#" className="js-delete text-muted" onClick={onDeleteClick}>
            Delete message
        </a>
        <a href="#" className="text-muted" onClick={onEditClick}>
            Edit Message
        </a>
    </div>
}