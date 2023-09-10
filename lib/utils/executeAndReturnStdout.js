const { execSync } = require('child_process');

module.exports = (command) => (
  execSync(
    command,
    {
      encoding: 'utf8',
      stdio: [
        'pipe', // Default for stdin
        'pipe', // Default for stdout
        'ignore', // Ignore stderr
      ],
    },
  ).replace(/\n$/, '')
);
