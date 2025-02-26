Modern browsers still allow the use of absolute paths with the `download` attribute due to several reasons:

1. **Backward Compatibility**: Web standards and browser behaviors often maintain support for older features to ensure that existing websites continue to function as intended. Removing support for absolute paths could break numerous websites that rely on this functionality.

2. **Flexibility for Developers**: Allowing absolute paths gives developers more control over where files are downloaded from. This can be useful in certain scenarios, such as when serving files from different directories on the server.

3. **Security is a Shared Responsibility**: While browsers could impose stricter rules, security is also the responsibility of the server and application developers. Browsers provide the tools and mechanisms (like the `download` attribute), but it's up to the server to ensure that these are used securely.

4. **User Experience**: In some cases, users might want to download files from specific locations on the server. Restricting absolute paths at the browser level could limit user options and flexibility.

However, it's important for developers to be aware of the security risks and implement appropriate server-side measures to mitigate these risks, as outlined in the previous sections.

