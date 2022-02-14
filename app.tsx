import React, { useState, useEffect, useCallback } from 'react';
import * as ReactDOM from 'react-dom'

import { query, initIHPBackend, UUID } from 'ihp-backend';
import { useQuery, IHPBackend, useIsLoggedIn } from 'ihp-backend/react';

import Sidebar from './Sidebar';
import Message from './Message';
import { NewMessageForm, NewMessageFormIfLoggedOut } from './NewMessageForm';

function App() {
    // This var keeps track of the currently selected channel
    const [channelId, setChannelId] = useState<UUID | null>(null);

    return <IHPBackend requireLogin={false}>
        <div className="container-fluid">
            <div className="row">
                <div className="col-3 bg-light pt-4">
                    <Sidebar channelId={channelId} setChannelId={setChannelId} />
                </div>

                <div className="col-9">
                    {channelId !== null
                        ? <MessagesContainer channelId={channelId}/>
                        : <span>Select a channel</span>
                    }

                </div>
            </div>
        </div>
    </IHPBackend>
}

interface MessagesContainerProps {
    channelId: UUID
}
function MessagesContainer({ channelId }: MessagesContainerProps) {
    const messages = useQuery(query('messages').filterWhere('channelId', channelId).orderBy('createdAt'));
    const isLoggedIn = useIsLoggedIn();

    return <div>
        <div className="messages">
            {messages?.map(message => <Message message={message} key={message.id}/>)}
        </div>
        
        {isLoggedIn
            ? (channelId !== null && <NewMessageForm channelId={channelId}/>)
            : <NewMessageFormIfLoggedOut />
        }
    </div>
}

// This needs to be run before any calls to `query`, `createRecord`, etc.
initIHPBackend({ host: process.env.BACKEND_URL });

// Start the React app
ReactDOM.render(<App/>, document.getElementById('app'));
