# Requirements

In order for DataLabs to function there must be an OpenID connect (OIDC) compliant authentication provider (e.g Auth0, Keycloak, AWS Cognito) which will either
store user information directly or serve to re-direct users to a different
authentication provider which in turn will allow a user to receive an identity
token.

All providers are different and offer various advantages. There are multiple
considerations to make including how user registration is expected to work,
and the convenience/limits of using a cloud (Auth0) vs a hosted solution.

## Application Setup

DataLabs requires an OIDC compliant application to use for authentication. Hence
once a provider is chosen an application must be set up for authentication, the
method for doing this will vary depending on the provider, however some example
guides can be found here;

- [Auth0](https://auth0.com/docs/applications/set-up-an-application/register-single-page-app)
- [Keycloak](https://robferguson.org/blog/2019/12/24/getting-started-with-keycloak/)

Requirement for OIDC application;

- The name should be recognisable by users logging in as they will generally be re-directed a separate login page with the time.
- The client must be OIDC compliant (this is typically a configuration option
  during creation).
- Callback URLs must be configured to match the callback URLs of the DataLab deployment.
  This ensures that the OIDC provider will only redirect to your DataLab deployment
  (e.g after logging a user in) which is crucial as the redirects contain secure
  credentials.This should include the following URLS at minimum;

```bash
https://datalabName.domain/callback,https://datalabName.domain/silent-callback
# e.g
# https://datalab.datalabs.ceh.ac.uk/callback,https://datalab.datalabs.ceh.ac.uk/silent-callback
```

- The application must have access to the user/account lists that you wish users
  to authenticate with.

## Configuration

When deploying DataLabs on Kubernetes the configuration must reflect the OIDC
provider and application you have created.
[This](https://github.com/NERC-CEH/datalab-k8s-manifests) repository shows an
example. The two main components that must be configured are found below.

### Web App Configmap

The web application relies on the `oidc-client-js` library for interacting with
OIDC, the configuration
([documentation](https://github.com/IdentityModel/oidc-client-js/wiki)) for
which must be deployed within a configmap as a JSON object - example found
[here](https://github.com/NERC-CEH/datalab-k8s-manifests/blob/master/templates/datalab/oidc-configmap.template.yml).
Depending on which provider is being used the settings required may be different
hence you may need to read the providers documentation. Below are two examples
of different OIDC providers and associated configuration.

- Auth0 (with an auth0 tenancy named `example.eu.auth0.com`)

```yaml
    {
      "client_id": "{{ oidcProviderClientId }}",
      "redirect_uri": "https://{{ datalabName }}.{{ domain }}/callback",
      "response_type": "code",
      "scope": "openid profile",
      "authority": "https://example.eu.auth0.com",
      "automaticSilentRenew": true,
      "accessTokenExpiringNotificationTime": "600",
      "filterProtocolClaims": true,
      "loadUserInfo": true,
      "extraQueryParams": {
          "audience": "https://{{ datalabName }}.{{ domain }}/api"
      },
      "metadata": {
          "issuer": "https://example.eu.auth0.com/",
          "authorization_endpoint": "https://example.eu.auth0.com/authorize",
          "userinfo_endpoint": "https://example.eu.auth0.com/userinfo",
          "end_session_endpoint": "https://example.eu.auth0.com/v2/logout?returnTo=https://{{ datalabName }}.{{ domain }}/&client_id={{ oidcProviderClientId }}",
          "jwks_uri": "https://example.eu.auth0.com/.well-known/jwks.json",
          "token_endpoint": "https://example.eu.auth0.com/oauth/token"
      }
    }
```

- Keycloak (with a keycloak instance set up on a accessible host which can be
  resolved via `keycloak` on port `8080`, and a realm created (which the client
  exists within) called `Datalabs`).

```yaml
    {
      "client_id": "{{ oidcProviderClientId }}",
      "redirect_uri": "https://{{ datalabName }}.{{ domain }}/callback",
      "response_type": "code",
      "scope": "openid profile email",
      "authority": "http://keycloak:8080/auth/realms/DataLabs",
      "automaticSilentRenew": true,
      "accessTokenExpiringNotificationTime": "600",
      "filterProtocolClaims": true,
      "loadUserInfo": true,
      "metadata": {
        "issuer": "http://keycloak:8080/auth/realms/DataLabs",
        "authorization_endpoint": "http://keycloak:8080/auth/realms/DataLabs/protocol/openid-connect/auth",
        "userinfo_endpoint": "http://keycloak:8080/auth/realms/DataLabs/protocol/openid-connect/userinfo",
        "end_session_endpoint": "http://keycloak:8080/auth/realms/DataLabs/protocol/openid-connect/logout?redirect_uri=https://{{ datalabName }}.{{ domain }}",
        "jwks_uri": "http://keycloak:8080/auth/realms/DataLabs/protocol/openid-connect/certs",
        "token_endpoint": "http://keycloak:8080/auth/realms/DataLabs/protocol/openid-connect/token"
      }
    }
```

Once these are configured within the configmap they will be served up by the
web-app for the client to use. Depending on whether users can sign up or not,
they may need to be added manually to the user/account list via the OIDC
provider.

### Authentication Service Configuration

The other element required to be configured to the OIDC endpoint is the
authentication service. This service is responsible for handling requests around
user permissions and hence must be able to validate the token which is presented
by end-users. In order to do this it must be able to see the public key of the
authentication provider.

This is generally but not always provided in the form of a `well-known`
endpoint. The application has been configured to allow for this as well as
directly configuring the endpoints that should be used. Below are the variables
which should be set as environmental variables in the [authentication service
manifest](https://github.com/NERC-CEH/datalab-k8s-manifests/blob/master/templates/datalab/datalab-auth-deployment.template.yml)
when deploying DataLabs.

The following parameters must be specified regardless of the OIDC provider being
used;

| Name                   | Description                                                                                                                                                             | Example                     |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| OIDC_PROVIDER_DOMAIN   | This should be the base URL of the OIDC provider                                                                                                                        | https://tenancy.auth0.com/  |
| OIDC_PROVIDER_AUDIENCE | This will be a value which is custom to the DataLabs deployment and will be used as the audience parameter on internal tokens that the authentication service generates | https://datalabs.domain/api |


Not all providers offer a `${OIDC_PROVIDER_DOMAIN}/.well-known/openid-configuration` endpoint. If the provider you are using does not, two additional parameters must be specified for the necessary configuration information.

| Name                      | Description                                                | Example (and default)  |
|---------------------------|------------------------------------------------------------|------------------------|
| OIDC_OAUTH_TOKEN_ENDPOINT | Endpoint from the BASE URL where oauth tokens can be found | /oauth/token           |
| OIDC_JWKS_ENDPOINT        | Endpoint from the BASE URL where JWKs can be found         | /.well-known/jwks.json |

### Self-service sign-up
Depending on your identity provider, self-service sign-up may or may not be possible.
The appropriate corresponding behaviour is configured in the [configmap](https://github.com/NERC-CEH/datalab-k8s-manifests/blob/master/templates/datalab/oidc-configmap.template.yml).

**Self-service is available**
```yaml
  "signUp": {
    "selfService": true
  }
```
In this case, the 'Sign Up' button of DataLabs will redirect to the identity provider's sign-in page.

**Self-service is not available**
```yaml
  "signUp": {
    "selfService": false,
    "requestEmail": "appsupport@ceh.ac.uk"
  }
```
In this case, the 'Sign Up' button of DataLabs will redirect to a page asking the user to request an account by emailing the `requestEmail` address.
