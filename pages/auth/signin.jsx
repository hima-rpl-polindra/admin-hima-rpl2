"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";

export default function signin() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // Attempt to sign in using the credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (!result.error) {
        // Successfully sign-in
        router.push("/");
      } else {
        // Handle sign-in error
        setError("Invalid email or password");
        setTimeout(() => {
          setError("");
        }, 4000);
      }
    } catch (error) {
      setError("Sign-in failed. please try again");
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setLoading(false); // ensure loading in set to false in all cases
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  if (status === "loading") {
    return (
      <div className="auth__loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="auth__page">
      <div className="auth__form">
        <div className="auth__form__title">Masuk Akun</div>
        {loading ? (
          <div className="auth__loading">
            {" "}
            <Spinner /> Mengecek..
          </div>
        ) : (
          <>
            <form className="auth__form__content" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="auth__user__input"
                required
                value={form.email}
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="auth__user__input"
                required
                value={form.password}
                placeholder="Password"
              />
              <input type="submit" className="auth__button" value="Masuk" />
              {error && <p>{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
