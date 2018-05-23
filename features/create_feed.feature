Feature: Create Feed
  In order to have a good experience
  As a user
  I want to create feeds and see articles quickly

  Scenario: Users should be able to create 3 feeds with each having at least 1 articles within a minute
    And a valid user
    When he logins
    And he creates 3 feeds in parallel
    Then he should see at least 1 article in each feed in 1 minute

