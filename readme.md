## Requirements

- Node version `>14`
- Docker

## How to set up

- Create your `.env` file based on `.env.example` (you can just copy paste all info from it);
- `npm i`;
- To up `DB` locally use `npm` command `npm run docker:run`;
- To create tables in your `DB` - `npm run migration:run`;
- And finally `npm run dev`.

## API

[Link to API](http://localhost:4200/api-docs)
