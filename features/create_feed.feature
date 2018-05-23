Feature: Create Feed
  Users want to create a feed to get summarized news

  Scenario: Users should be able to create 3 feeds with each having at least 1 articles within a minute
    Given a valid user
    And he logins
    When he creates 3 feeds in parallel
    Then he should see at least 1 article in each feed

