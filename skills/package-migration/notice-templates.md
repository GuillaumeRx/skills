# Notice templates

Use these templates for the source README and source pull requests. Replace only the placeholders in angle brackets. Keep the HTML structure and wording unchanged. If a required value is unknown, stop and ask for it.

## Temporary source README notice

Use in Phase A, PR 1.

```html
<table><tr><td><p align="center"><b>⚠️ PLEASE READ ⚠️</b></p><p align="center">This package is currently being migrated to our <a href="<destination-url>"><code><destination-name></code></a> monorepo. Please do not make any commits to this repository while this migration is taking place, as they will not be transferred over. Also, please re-open PRs that are under active development in the <a href="<destination-url>"><code><destination-name></code></a> repo.</p></td></tr></table>
```

Required values:

- `<destination-url>`: URL of the destination monorepo
- `<destination-name>`: short destination repository name

## Permanent source README notice

Use in Phase D, PR 13. Replace the temporary notice.

```html
<table>
  <tr>
    <td>
      <p align="center"><b>⚠️ PLEASE READ ⚠️</b></p>
      <p align="center">
        This package has been migrated to our
        <a href="<destination-url>"><code><destination-name></code></a>
        monorepo, and this repository has been archived. Please note that all
        future development and feature releases will take place in the
        <a href="<destination-url>"><code><destination-name></code></a>
        repository.
      </p>
    </td>
  </tr>
</table>
```

Required values:

- `<destination-url>`: URL of the destination monorepo
- `<destination-name>`: short destination repository name

## Source pull request comment

Use on approved open source pull requests during Phase D.

```text
This library has now been migrated into the [<destination-name> monorepo](<destination-url>). This PR has been locked and this repo will be archived shortly. Going forward, releases of this library will only include changes made in the <destination-name> repo.

- Please push this branch to <destination-name> and open a new PR there.
- Optionally, add a link pointing to the discussion in this PR to provide context.
```

Required values:

- `<destination-name>`: short destination repository name
- `<destination-url>`: URL of the destination monorepo

## Rendering rules

- Render the values from repository metadata. Do not guess URLs or names.
- Show the rendered text to the user before the first public use.
- Reuse the same rendered template for all approved source PRs.
- Record the rendered text and target objects in the migration ledger.
- Keep the comment and README unchanged when a required value has no value.
