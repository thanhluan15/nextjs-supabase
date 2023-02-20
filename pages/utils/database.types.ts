export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          update_at: string;
          username: string | null;
          fullname: string | null;
          avatarUrl: string | null;
          website: string | null;
        }; // The data expected to be returned from a "select" statement.
        Insert: {}; // The data expected passed to an "insert" statement.
        Update: {}; // The data expected passed to an "update" statement.
      };
      beverage: {
        Row: {};
        Insert: {};
        Update: {};
      };
    };
  };
}
