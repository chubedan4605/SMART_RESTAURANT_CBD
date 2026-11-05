const jwt = require("jsonwebtoken");
const socketAuthMiddleware = require("../src/middlewares/socketAuthMiddleware");
const config = require("../src/config/index");
const socketDestination = require("../src/config/socketDestination");

describe("Socket Auth & RBAC Handshake Middleware", () => {
  const secret = config.auth.accessTokenSecret || "test-secret";
  process.env.QR_SECRET = "test-qr-secret";

  function createMockSocket(auth = {}, query = {}, headers = {}) {
    const joinedRooms = new Set();
    return {
      id: "mock-socket-id",
      handshake: {
        auth,
        query,
        headers,
      },
      join: jest.fn((room) => joinedRooms.add(room)),
      _joinedRooms: joinedRooms,
    };
  }

  it("should authenticate Admin JWT and auto-join admin_room", async () => {
    const token = jwt.sign({ id: 1, role: "admin", email: "admin@test.com" }, secret);
    const socket = createMockSocket({ token });
    const next = jest.fn();

    await socketAuthMiddleware(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeDefined();
    expect(socket.user.role).toBe("admin");
    expect(socket.join).toHaveBeenCalledWith(socketDestination.ADMIN);
    expect(socket._joinedRooms.has(socketDestination.ADMIN)).toBe(true);
  });

  it("should authenticate Waiter JWT and auto-join waiter_room", async () => {
    const token = jwt.sign({ id: 2, role: "waiter", email: "waiter@test.com" }, secret);
    const socket = createMockSocket({ token });
    const next = jest.fn();

    await socketAuthMiddleware(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeDefined();
    expect(socket.user.role).toBe("waiter");
    expect(socket.join).toHaveBeenCalledWith(socketDestination.WAITER);
  });

  it("should authenticate Kitchen JWT and auto-join kitchen_room", async () => {
    const token = jwt.sign({ id: 3, role: "kitchen", email: "kitchen@test.com" }, secret);
    const socket = createMockSocket({ token });
    const next = jest.fn();

    await socketAuthMiddleware(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeDefined();
    expect(socket.user.role).toBe("kitchen");
    expect(socket.join).toHaveBeenCalledWith(socketDestination.KITCHEN);
  });

  it("should authenticate valid QR token and auto-join table room", async () => {
    const qrToken = jwt.sign({ table_id: 10, table_number: "Bàn 10" }, process.env.QR_SECRET);
    const socket = createMockSocket({ qrToken });
    const next = jest.fn();

    await socketAuthMiddleware(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(socket.table).toBeDefined();
    expect(socket.table.table_id).toBe(10);
    expect(socket.join).toHaveBeenCalledWith(socketDestination.TABLE(10));
  });

  it("should safely handle invalid token without room escalation", async () => {
    const socket = createMockSocket({ token: "invalid-fake-token" });
    const next = jest.fn();

    await socketAuthMiddleware(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeNull();
    expect(socket.join).not.toHaveBeenCalled();
  });
});

