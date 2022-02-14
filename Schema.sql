CREATE FUNCTION set_updated_at_to_now() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    access_token TEXT DEFAULT NULL,
    confirmation_token TEXT DEFAULT NULL,
    is_confirmed BOOLEAN DEFAULT false NOT NULL,
    name TEXT DEFAULT NULL
);
CREATE POLICY "Users can read their own record" ON users USING (id = ihp_user_id()) WITH CHECK (false);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE TABLE channels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID DEFAULT ihp_user_id() NOT NULL
);
CREATE INDEX channels_created_at_index ON channels (created_at);
CREATE INDEX channels_user_id_index ON channels (user_id);
ALTER TABLE channels ADD CONSTRAINT channels_ref_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;
CREATE POLICY "Users can edit their channels, but every channel is public" ON channels USING (true) WITH CHECK (user_id = ihp_user_id());
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    body TEXT NOT NULL,
    user_id UUID DEFAULT ihp_user_id() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    channel_id UUID NOT NULL
);
CREATE INDEX messages_user_id_index ON messages (user_id);
ALTER TABLE messages ADD CONSTRAINT messages_ref_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;
CREATE POLICY "Users can manage their messages" ON messages USING (true) WITH CHECK (user_id = ihp_user_id());
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX messages_created_at_index ON messages (created_at);
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION set_updated_at_to_now();
CREATE INDEX messages_channel_id_index ON messages (channel_id);
ALTER TABLE messages ADD CONSTRAINT messages_ref_channel_id FOREIGN KEY (channel_id) REFERENCES channels (id) ON DELETE NO ACTION;
