# AgriTrace — Agent Skills & Coding Standards

This file defines *how* to write code for this project. Follow these rules strictly.

---

## Toolchain Commands
| Task | Command |
|------|---------|
| Compile | `forge build` |
| Run all tests | `forge test -vvv` |
| Run specific test | `forge test --match-path test/EscrowManager.t.sol -vvv` |
| Start local blockchain | `anvil` |
| Deploy (local) | `forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast` |
| Run Slither | `slither . --print human-summary` |

---

## Solidity Patterns (Must Use)

### Imports
```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

Role Inheritance

contract EscrowManager is Roles, ReentrancyGuard {
    // `Roles` already provides `PRODUCER_ROLE`, `BUYER_ROLE`, etc.
}


State Machine Pattern
enum OrderState { Created, PickedUp, Delivered, Settled, Disputed }

mapping(bytes32 => OrderState) public orderState;

function markPickedUp(bytes32 orderId) external onlyRole(LOGISTICS_ROLE) {
    require(orderState[orderId] == OrderState.Created, "Invalid state");
    // ... logic ...
    orderState[orderId] = OrderState.PickedUp;
}
Percentage Math (Basis Points)
// 1.5% = 150 basis points (bps)
uint256 cess = cropValue * 150 / 10000;

// 30% = 3000 bps
uint256 advance = freightValue * 3000 / 10000;

Reentrancy Guard & Checks‑Effects‑Interactions
function releaseFunds() external nonReentrant onlyRole(WAREHOUSE_ROLE) {
    // checks
    // effects (update state FIRST)
    orderState[orderId] = OrderState.Settled;
    // interactions (external calls LAST)
    IERC20(token).transfer(recipient, amount);
}

Events (with indexed fields)
event DeliveryConfirmed(bytes32 indexed orderId, uint256 weighbridgeReading, uint256 timestamp);

Always include indexed fields for easy off‑chain querying.

Emit events after state changes.
Testing Standards (Important)
vm.prank – Avoid nested pranks

    Store view results before prank:

    bytes32 role = roles.PRODUCER_ROLE(); // get value first
vm.prank(unauthorized);
vm.expectRevert();
roles.grantRole(role, producer);

Test structure:
function setUp() public {
    // Deploy contracts (no prank needed if test contract is admin)
    escrow = new EscrowManager();
    // Grant roles if needed
    escrow.grantRole(escrow.BUYER_ROLE(), buyer);
}
Assertions:
assertEq(uint256(state), uint256(OrderState.Settled));
assertTrue(token.balanceOf(farmer) == expectedAmount);

Code Style (Enforced)

    Pragma: pragma solidity ^0.8.20;

    NatSpec: Every public/external function must have @dev, @param, @return comments.

    Constants: Use bytes32 public constant for role hashes.

    Variables: Use camelCase for functions, UPPER_CASE for constants.

    Ordering: State variables → Events → Modifiers → Constructor → External → Public → Internal → Private.
Pragma: ^0.8.20

NatSpec on every public/external function.

Constants: bytes32 public constant ROLE_NAME = keccak256("ROLE_NAME");

Order: State → Events → Modifiers → Constructor → External → Public → Internal → Private.


    Git Workflow

    Branch: blkchn-wrk
Commit messages: feat: ..., fix: ..., test: ...
    Commit messages: feat: Add EscrowManager.sol with tests or fix: Resolve reentrancy issue

    Push: git push origin blkchn-wrk



    Explicit Non‑Goals (Do Not Attempt)

    Hyperledger Fabric

    Real IoT/weighbridge hardware

    Production‑grade oracle networks (Chainlink)

    Proxy/upgradeable contracts (Diamond, UUPS)

    Storing images or PII on‑chain

    f Stuck

    Search Foundry Book: https://book.getfoundry.sh/

    Check OpenZeppelin docs: https://docs.openzeppelin.com/contracts/

    Ask the human  for clarification – better to ask than guess.

---

## Where to Place These Files

```bash
# Copy this into your terminal to create both files in the root directory
cd /c/Users/Pranav\ Shewale/TeamNeuroBytes

cat > agents.md << 'EOF'
[PASTE THE CONTENT OF agents.md HERE]
EOF

cat > skills.md << 'EOF'
[PASTE THE CONTENT OF skills.md HERE]
EOF


Backend‑Specific Patterns (later steps)

    ABI loading: read blockchain/out/*.json + deployments.json from Python.

    Event listener: use web3.contract.events.EventName.create_filter(fromBlock=...) and poll.

    Relayer: use a hot wallet with private key from environment to sign transactions.

    All backend‑side chain calls go through web3.py.