const { expect } = require("chai");

contract("CrowdFunding", (accounts) => {
  let crowdFunding;

  beforeEach(async () => {
    crowdFunding = await CrowdFunding.deployed();
  });

  it("should create a new campaign", async () => {
    const target = 100;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now

    await crowdFunding.createCampaign("1", target, deadline, {
      from: accounts[0],
    });

    const campaign = await crowdFunding.campaigns(0);

    assert.equal(campaign.id, "1");
    assert.equal(campaign.owner, accounts[0]);
    assert.equal(campaign.target.toNumber(), target);
    assert.equal(campaign.deadline.toNumber(), deadline);
    assert.equal(campaign.amountCollected.toNumber(), 0);
  });

  it("should not create a campaign with a deadline in the past", async () => {
    const target = 100;
    const deadline = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

    try {
      await crowdFunding.createCampaign("2", target, deadline, {
        from: accounts[0],
      });
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      assert.include(
        err.message,
        "The deadline should be a date in the future.",
        "The error message should contain 'The deadline should be a date in the future.'"
      );
    }
  });
});
