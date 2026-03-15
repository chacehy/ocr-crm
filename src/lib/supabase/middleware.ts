import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Log cookie count to see if they are actually being sent
    const cookieCount = request.cookies.getAll().length
    console.log(`Middleware: ${request.nextUrl.pathname} | Cookies: ${cookieCount}`)

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error) {
        console.error('Middleware Auth Error:', error.message)
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/api/webhooks') &&
        request.nextUrl.pathname !== '/'
    ) {
        console.log('Middleware: Redirecting to /login from', request.nextUrl.pathname)
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    //    the cookies!
    // 4. Finally: return myNewResponse

    return supabaseResponse
}
