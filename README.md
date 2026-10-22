# Nafnaval.is

![CI/CD](https://github.com/sindrig/nafnaval/workflows/CI/CD/badge.svg)

A free service for soon-to-be parents that need to select valid Icelandic names for their newborns.

## Development

Start your local backend:

    make local-env

A production build will be available at [localhost:8080](http://localhost:8080).

The deployed backend and Lambda package use Python 3.12. The legacy LocalStack
environment overrides the runtime to Python 3.8 locally.

You can of course run the front-end:

    cd frontend
    yarn start

## Deploying manually

    make target=staging deploy
    make target=prod deploy

## Signup protection

Signup emails are protected entirely within AWS:

- A regional AWS WAF web ACL requires CAPTCHA verification for every `PUT`
  request to the staging and production APIs, including the direct API Gateway
  URL. Other methods remain available for existing lists. It also rate-limits
  signup requests to 20 per IP per five minutes.
- DynamoDB transactions reserve all sending limits before creating lists or
  sending mail: three signups per IP per UTC hour, 50 signups (at most 100
  emails) per UTC day, and one signup email per normalized recipient per 24
  hours, per environment. Protection failures reject registration rather than
  sending anyway.
- Production has account-wide SES reputation alarms at a 0.05% complaint rate
  and a 3% bounce rate. SNS sends alerts independently of SES. Confirm the SNS
  subscription sent to `sindrigudmundsson@gmail.com` after an authorized apply.

The CAPTCHA domain-bound client API keys are provisioned by Terraform and
published in `env.json`; these are not AWS credentials. The public CAPTCHA SDK
URL in the signup-protection module is account/region-specific, obtained from
WAF `ListAPIKeys` in account `525422706348`, `eu-west-1`. Update that URL if
moving to a different account or region. No third-party CAPTCHA account or
server secret is required. AWS WAF and CAPTCHA usage incur AWS charges.

### Safe rollout

Production registration is controlled by `signups_enabled` in
`infra/prod/main.tf`. Set it to `false` to pause new signups while existing lists
can still be opened, edited, and compared. Only enable registration after the
protected flow has been verified on staging.

The first rollout needs an explicitly authorized operator to review the
Terraform AWS provider upgrade from v3 to v5, provision the new WAF, DynamoDB,
and monitoring resources, and deploy the Python 3.12 package and frontend. The
existing CI deployment user also needs scoped permissions to refresh and
manage the new protection resources before automated deployments can resume.
The deployment job is gated by the repository variable
`AWS_DEPLOYMENTS_ENABLED`; leave it unset until those permissions have been
reviewed and granted, then set it to `true` to resume deployments on `main`.
Backend, frontend, and local integration checks run regardless of this gate.
Do not run the deployment commands as part of a read-only investigation.

Automated local integration tests use LocalStack without WAF; staging CI uses
a non-sending smoke test. Before enabling production, manually verify CAPTCHA
success/failure, cross-origin token delivery, cooldowns, and the two delivered
links using mailboxes you control. This requires separate deployment/testing
approval. Only describe fixes as implemented in the AWS Support case after
they have actually been deployed.
