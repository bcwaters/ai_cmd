In Nextra, you can use annotations to enhance your documentation with additional features and metadata. Here's an overview of the annotation style used in Nextra:

### Nextra Annotation Style

Nextra supports annotations through the use of YAML front matter at the beginning of your Markdown or MDX files. These annotations allow you to customize the behavior and appearance of your documentation pages.

#### Basic Syntax

The annotations are placed at the top of your Markdown or MDX file, enclosed by `---` lines. Here's the basic structure:

```markdown
---
title: Your Page Title
description: A brief description of the page
---
```

#### Common Annotations

Here are some common annotations you might use in Nextra:

1. **title**: Sets the title of the page.
2. **description**: Provides a brief description of the page, which can be useful for SEO.
3. **sidebarLabel**: Customizes the label that appears in the sidebar for the page.
4. **draft**: Marks the page as a draft, which can be useful during development.

#### Example

Here's an example of how you might use annotations in a Nextra documentation file:

```markdown
---
title: Getting Started with Nextra
description: Learn how to set up and use Nextra for your Next.js project.
sidebarLabel: Quick Start
draft: false
---

# Getting Started with Nextra

Welcome to the quick start guide for Nextra. Here's how to get started...

```

#### Additional Custom Annotations

Nextra allows you to define custom annotations, which can be used to add metadata or control specific behaviors. For instance, you might use custom annotations to control the layout or add specific metadata for your documentation system.

```markdown
---
customLayout: wide
tags: [tutorial, beginner]
---

# Your Documentation Content

...
```

These custom annotations can then be processed by your Next.js application to apply specific styles or behaviors.

### Conclusion

Using annotations in Nextra allows you to add metadata and customize the behavior of your documentation pages. By leveraging YAML front matter, you can enhance the functionality and appearance of your Next.js documentation.

