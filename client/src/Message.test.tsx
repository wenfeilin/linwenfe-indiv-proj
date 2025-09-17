import Message from "./Message";
import { render } from "@testing-library/react";

describe("First tests", () => {
  it("Should render component", () => {
    render(<Message />);
    expect(true).toBeTruthy();
  });
});
