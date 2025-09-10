// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function SignUp() {
//   // const {data: session, status} = useSession();
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");

//   const router = useRouter();

//   //   authenticate
//   useEffect(() => {
//     // if (status == 'authenticated')
//     //   router.push('/')
//   }, []); // status, router

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (form.password !== form.confirmPassword) {
//       setError("Password do not match");
//       return;
//     }

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (data.error) {
//       setError("Error happend here");
//       setTimeout(() => {
//         setError("");
//       }, 3000); // remove error after 3 seconds
//     } else {
//       router.push("/auth/signin");
//     }
//   };

//   return (
//     <>
//       <div className="auth__page">
//         <div className="auth__form">
//           <div className="auth__form__title">Daftar Admin</div>

//           <form className="auth__form__content" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               onChange={handleChange}
//               className="auth__user__input"
//               placeholder="Masukkan Email"
//             />
//             <input
//               type="password"
//               name="password"
//               onChange={handleChange}
//               className="auth__user__input"
//               placeholder="Masukkan Password"
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               onChange={handleChange}
//               className="auth__user__input"
//               placeholder="Konfirmasi Password"
//             />
//             <button className="auth__button" type="submit">
//               Daftar
//             </button>
//             {error && <p>{error}</p>}
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// If you want to add a user / admin, turn it off using the code above, and comment the code below.

import { useEffect } from "react";
export default function SingnUp() {
  useEffect(() => {
    console.error(
      "You don't have permission to sign up to this admin dashboard"
    );
  }, []);
  return null;
}
