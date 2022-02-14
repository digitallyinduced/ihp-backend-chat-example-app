import React, { useEffect, useCallback } from 'react';
import { query, createRecord, logout, Channel, UUID } from 'ihp-backend';
import { useQuery, useCurrentUser } from 'ihp-backend/react';

interface SidebarProps {
    channelId: UUID | null,
    setChannelId: (id: UUID) => void
}
export default function Sidebar({ channelId, setChannelId }: SidebarProps) {
    const channels = useQuery(query('channels').orderBy('name'));

    // Select first channel if no channel selected
    useEffect(() => {
        if (channelId === null && channels !== null) {
            setChannelId(channels[0].id);
        }
    }, [channels, channelId]);

    return <div>
        <h1 className="mb-3 border-bottom">Chat</h1>

        <ul className="nav nav-pills flex-column">
            {channels?.map(channel => <SidebarChannel
                channel={channel}
                key={channel.id}
                setChannelId={setChannelId}
                isActive={channel.id === channelId}
            />)}
            
            <li className={"nav-item"}>
                <a className="nav-link" onClick={newChannelClick} href="#">+ New Channel</a>
            </li>
        </ul>

        <hr />

        <Logout/>
    </div>
}

function newChannelClick() {
    const name = window.prompt('Name:') || '';
    if (name === '') {
        return;
    }

    createRecord('channels', { name });
}

interface SidebarChannelProps {
    channel: Channel;
    setChannelId: (id: UUID) => void,
    isActive: boolean
}

function SidebarChannel({ channel, setChannelId, isActive }: SidebarChannelProps) {
    const onClick = useCallback(() => setChannelId(channel.id), [setChannelId, channel]);
    
    return <li className="nav-item">
        <a className={"nav-link" + (isActive ? ' active' : '')} href="#" onClick={onClick}>{channel.name}</a>
    </li>
}

function Logout() {
    const user = useCurrentUser();
    if (!user) {
        return null;
    }

    return <a href="#" className="js-delete js-delete-no-confirm text-muted" style={{fontSize: 12}} onClick={logout}>← Logout {user?.email}</a>
}