# Contributing to NexDentify

Thank you for your interest in contributing to NexDentify! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### **Code Contributions**
- Bug fixes and improvements
- New features and enhancements
- Performance optimizations
- Documentation updates

### **Non-Code Contributions**
- Bug reports and feature requests
- Documentation improvements
- Community support
- Testing and feedback

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- Basic knowledge of React, TypeScript, and blockchain concepts

### **Development Setup**

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/nexdentify-app.git
   cd nexdentify-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### **Code Style**
- Use TypeScript for all new code
- Follow existing code formatting (ESLint + Prettier)
- Write meaningful variable and function names
- Add comments for complex logic

### **Component Guidelines**
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Add proper error handling

### **Testing Requirements**
- Write unit tests for new functions
- Add integration tests for components
- Ensure all tests pass before submitting
- Maintain or improve test coverage

### **Commit Messages**
Use conventional commit format:
```
type(scope): description

feat(auth): add biometric authentication
fix(wallet): resolve connection timeout issue
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

### **Before Submitting**
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

### **Submitting the PR**
1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use a descriptive title
   - Provide detailed description
   - Reference related issues
   - Add screenshots if applicable

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added tests for new functionality
   - [ ] Manual testing completed

   ## Screenshots
   (if applicable)

   ## Related Issues
   Fixes #123
   ```

## 🐛 Bug Reports

### **Before Reporting**
- Check existing issues
- Reproduce the bug
- Gather relevant information

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

## 💡 Feature Requests

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Mockups, examples, etc.
```

## 🏗️ Architecture Guidelines

### **Smart Contracts**
- Follow Algorand best practices
- Include comprehensive tests
- Document contract interfaces
- Consider gas optimization

### **Frontend Architecture**
- Use React hooks for state management
- Implement proper error boundaries
- Follow component composition patterns
- Optimize for performance

### **Security Considerations**
- Validate all user inputs
- Implement proper error handling
- Use secure storage for sensitive data
- Follow OWASP guidelines

## 📚 Documentation

### **Code Documentation**
- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Keep documentation up-to-date

### **README Updates**
- Update installation instructions
- Add new feature documentation
- Include configuration changes
- Update troubleshooting guides

## 🧪 Testing Guidelines

### **Unit Tests**
- Test individual functions
- Mock external dependencies
- Cover edge cases
- Aim for high coverage

### **Integration Tests**
- Test component interactions
- Test service integrations
- Test user workflows
- Use realistic test data

### **E2E Tests**
- Test critical user paths
- Test across different browsers
- Test responsive design
- Test accessibility

## 🔍 Code Review Process

### **Review Criteria**
- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security considerations

### **Review Timeline**
- Initial review: 2-3 business days
- Follow-up reviews: 1-2 business days
- Urgent fixes: Same day

## 🎯 Issue Labels

### **Type Labels**
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `question`: Further information needed

### **Priority Labels**
- `priority/low`: Low priority
- `priority/medium`: Medium priority
- `priority/high`: High priority
- `priority/critical`: Critical issue

### **Status Labels**
- `status/needs-review`: Needs code review
- `status/needs-testing`: Needs testing
- `status/blocked`: Blocked by other issues
- `status/in-progress`: Currently being worked on

## 🏆 Recognition

### **Contributors**
All contributors will be recognized in:
- README.md contributors section
- Release notes
- Community Discord
- Annual contributor highlights

### **Maintainer Path**
Active contributors may be invited to become maintainers based on:
- Consistent quality contributions
- Community involvement
- Technical expertise
- Alignment with project values

## 📞 Getting Help

### **Community Support**
- **Discord**: [NexDentify Community](https://discord.gg/nexdentify)
- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests

### **Maintainer Contact**
- Create an issue for technical questions
- Use Discord for general discussions
- Email for security-related concerns

## 📋 Checklist for Contributors

### **Before Starting**
- [ ] Read this contributing guide
- [ ] Check existing issues and PRs
- [ ] Set up development environment
- [ ] Understand the codebase structure

### **During Development**
- [ ] Follow coding guidelines
- [ ] Write tests for new code
- [ ] Update documentation
- [ ] Test changes thoroughly

### **Before Submitting**
- [ ] Run all tests
- [ ] Check code style
- [ ] Update relevant documentation
- [ ] Create descriptive PR

## 🙏 Thank You

Thank you for contributing to NexDentify! Your efforts help build the future of decentralized identity. Every contribution, no matter how small, makes a difference.

---

**Questions?** Feel free to reach out on [Discord](https://discord.gg/nexdentify) or create an issue.