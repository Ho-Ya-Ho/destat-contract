// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Survey.sol";

struct SurveySchema {
    string title;
    string description;
    uint256 targetNumber;
    Question[] questions;
}

event SurveyCreated(address surveyAddress);

contract SurveyFactory {
    uint256 min_pool_amount;
    uint256 min_reward_amount;
    Survey[] surveys;

    // ex)
    // min pool amount : 50 eth
    // target respond number : 100
    // reward : 50 eth / 100 == 0.5 eth
    constructor(uint256 _min_pool_amount, uint256 _min_reward_amount) {
        min_pool_amount = _min_pool_amount;
        min_reward_amount = _min_reward_amount;
    }

    function createSurvey(SurveySchema calldata _survey) external payable {
        require(
            msg.value >= min_pool_amount,
            "Pool amount must be greater than minimum pool amount"
        );
        require(
            msg.value / _survey.targetNumber >= min_reward_amount,
            "Reward amount must be greater than minimum reward amount"
        );

        Survey survey = new Survey{value: msg.value}(
            _survey.title,
            _survey.description,
            _survey.targetNumber,
            _survey.questions
        );
        surveys.push(survey);
        emit SurveyCreated(address(survey));
    }

    function getMinPoolAmount() external view returns (uint256) {
        return min_pool_amount;
    }

    function getMinRewardAmount() external view returns (uint256) {
        return min_reward_amount;
    }

    function getSurveys() external view returns (Survey[] memory) {
        return surveys;
    }
}
