"use client";
import { UserButton } from "@clerk/nextjs";
import { GlobeLock } from "lucide-react";
import React from "react";

const UserMenu = () => {
  return (
    <UserButton
      appearence={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organizations"
          labelIcon={<GlobeLock size={15} />}
          href="/onboarding"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
