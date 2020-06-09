import React from 'react';
import ReactMarkdown from 'react-markdown';
import './About.css'
const markdown = `
## How?

Type in your e-mail and your partner's e-mail, select boy or girl, and
then submit. You'll both get unique links where you'll be presented with
one name and you can either accept it or deny it. When you've both
finished all legal Icelandic names you'll be presented with a common list
of names you both selected.

## Why?

When I had my first kid, some genius had the page nafn.is. Then when I
had my second kid, nafn.is was gone. I needed to select a good Icelandic
name, so obviously I recreated nafn.is.

## Who?

Written and hosted by [Sindri Guðmundsson](https://irdn.is).
`
export default () => (
  <div className="about">
    <ReactMarkdown source={markdown} />
  </div>
)
